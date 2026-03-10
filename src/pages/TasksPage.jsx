import { useState } from 'react';
import { Plus, Calendar, CheckSquare, Clock, ArrowRight, User, ExternalLink, Globe, LayoutList, GripVertical } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { campaigns } from '../data/mockData';
import TaskDetailModal from '../components/TaskDetailModal';
import PageHelp from '../components/PageHelp';

// We map our 10-step creative status model to 5 Kanban lanes for the overview
const STATUS_GROUPS = [
    { id: 'todo', title: 'Offen / KI-Phase', statuses: ['draft', 'ai_generating', 'ai_ready'], color: 'var(--text-tertiary)' },
    { id: 'review', title: 'In Review', statuses: ['review', 'revision'], color: 'var(--color-warning)' },
    { id: 'approved', title: 'Freigegeben', statuses: ['approved'], color: 'var(--color-info)' },
    { id: 'scheduled', title: 'Eingeplant', statuses: ['scheduled'], color: 'var(--color-primary)' },
    { id: 'done', title: 'Live / Erledigt', statuses: ['posted', 'monitoring', 'analyzed'], color: 'var(--color-success)' },
];

const UI_STATE_LABELS = {
    draft: 'Entwurf', ai_generating: 'KI generiert…', ai_ready: 'KI-Vorschlag', review: 'Im Review', revision: 'Überarbeitung',
    approved: 'Freigegeben', scheduled: 'Eingeplant', posted: 'Gepostet', monitoring: 'Beobachtung', analyzed: 'Analysiert'
};

export default function TasksPage() {
    const { tasks } = useTasks();
    const [view, setView] = useState('kanban');

    // Modal state for Task Details
    const [selectedTask, setSelectedTask] = useState(null);

    const getGroupTasks = (groupId) => {
        const group = STATUS_GROUPS.find(g => g.id === groupId);
        return tasks.filter(t => group.statuses.includes(t.status));
    };

    const getCampaignName = (campaignId) => {
        if (!campaignId) return 'Allgemein';
        return campaigns.find(c => c.id === campaignId)?.name || 'Unbekannte Kampagne';
    };

    // Card Renderer for Kanban
    const TaskCard = ({ task }) => (
        <div className="kanban-card" onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
            <div className="kanban-card-title">{task.title}</div>

            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span className="badge" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                    {UI_STATE_LABELS[task.status] || task.status}
                </span>
                {task.platform && (
                    <span className="badge badge-info" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                        {task.platform}
                    </span>
                )}
            </div>

            <div style={{ fontSize: '0.65rem', color: 'var(--color-primary)', background: 'var(--color-primary-50)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'inline-block', marginBottom: '8px' }}>
                {getCampaignName(task.campaignId)}
            </div>

            <div className="kanban-card-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white', fontWeight: 600 }}>
                        {task.assignee ? task.assignee.split(' ').map(n => n[0]).join('') : '?'}
                    </div>
                    <span>{task.assignee?.split(' ')[0] || 'Unzugewiesen'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: new Date(task.dueDate) < new Date() ? 'var(--color-danger)' : 'inherit' }}>
                        <Calendar size={10} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : 'Kein Datum'}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Globale Aufgaben & Creatives</h1>
                    <p className="page-subtitle">Alle Kampagnen-Creatives und anstehenden Tasks im Überblick ({tasks.length})</p>
                </div>
                <div className="page-header-actions">
                    <PageHelp title="Aufgaben-Kanban & Delegation">
                        <p style={{ marginBottom: '12px' }}>Willkommen im Ticket-Board! Hier werden alle offenen Aufträge für Creatives und Content-Elemente verwaltet.</p>
                        <ul className="help-list">
                            <li><strong>To Do / Offen:</strong> Hier landen alle frischen Aufgaben, die an das kreative Team delegiert wurden.</li>
                            <li><strong>Detailansicht:</strong> Klicke auf eine Kartekrte, um das Briefing des Managers zu lesen und den zugehörigen Content einzusehen.</li>
                            <li><strong>Ressourcen-Link (WICHTIG):</strong> Sobald du als Bearbeiter fertig bist, lade deine Dateien im Unternehmens-OneDrive hoch und speichere den Link in dieser Aufgabe.</li>
                            <li><strong>Status Updaten:</strong> Pflege den Status deiner Aufgaben gewissenhaft (auf In Progress oder Review), damit der Manager weiß, dass die Datei zur Freigabe liegt.</li>
                            <li><strong>Ansichten:</strong> Oben rechts kannst du zwischen Kanban-Board und Listen-Ansicht wechseln.</li>
                        </ul>
                    </PageHelp>
                    <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                        <button className={`btn btn-sm ${view === 'kanban' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('kanban')}><GripVertical size={14} /> Kanban</button>
                        <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('list')}><LayoutList size={14} /> Liste</button>
                    </div>
                    <button className="btn btn-primary" onClick={() => alert('Wird demnächst auf das globale Modal umgestellt.')}>
                        <Plus size={16} /> Neue Aufgabe
                    </button>
                </div>
            </div>

            {/* KANBAN VIEW */}
            {view === 'kanban' && (
                <div className="kanban-board">
                    {STATUS_GROUPS.map(group => {
                        const groupTasks = getGroupTasks(group.id);
                        return (
                            <div key={group.id} className="kanban-column" style={{ background: 'var(--bg-elevated)' }}>
                                <div className="kanban-column-header">
                                    <div className="kanban-column-title">
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.color }} />
                                        {group.title}
                                    </div>
                                    <span className="kanban-column-count">{groupTasks.length}</span>
                                </div>
                                {groupTasks.map(task => <TaskCard key={task.id} task={task} />)}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* LIST VIEW */}
            {view === 'list' && (
                <div className="card" style={{ padding: 0 }}>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Titel</th>
                                    <th>Status (Detail)</th>
                                    <th>Kampagne</th>
                                    <th>Bearbeiter</th>
                                    <th>Plattform</th>
                                    <th>Fällig am</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id} onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer' }}>
                                        <td style={{ fontWeight: 600 }}>{task.title}</td>
                                        <td>
                                            <span className="badge" style={{ background: 'var(--bg-elevated)' }}>
                                                {UI_STATE_LABELS[task.status] || task.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{getCampaignName(task.campaignId)}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-xs)' }}>
                                                <div style={{ width: 20, height: 20, borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.5rem', fontWeight: 600 }}>{task.assignee?.charAt(0) || '?'}</div>
                                                {task.assignee || '–'}
                                            </div>
                                        </td>
                                        <td><span className="badge badge-info">{task.platform || 'Alle'}</span></td>
                                        <td style={{ fontSize: 'var(--font-size-xs)' }}>
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('de-DE') : '–'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL (Slide-in oder Pop-up) */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}
