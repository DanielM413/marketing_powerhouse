import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Share2, Plus, Edit, MoreVertical, TrendingUp, Users, Map, Target, Heart, Megaphone, CheckCircle2, Link as LinkIcon, ListTodo, ExternalLink } from 'lucide-react';
import { touchpoints, campaigns, initialContents as content } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import PageHelp from '../components/PageHelp';

const TYPE_COLORS = {
    'Paid Search': 'badge-warning',
    'Paid Social': 'badge-warning',
    'Owned Website': 'badge-primary',
    'Owned CRM': 'badge-primary',
    'Direct Sales': 'badge-danger',
    'Organic Social': 'badge-info',
    'Earned Media': 'badge-success',
    'Product': 'badge-default'
};

export default function TouchpointsPage() {
    const { can } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const canEdit = can('canEditPositioning');

    const [selectedTpId, setSelectedTpId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Handle initial selection from navigation state (e.g. from Journey page)
    useEffect(() => {
        if (location.state?.selectedTpId) {
            setSelectedTpId(location.state.selectedTpId);
        }
    }, [location.state]);

    const filtered = touchpoints.filter(tp => {
        const matchSearch = tp.name.toLowerCase().includes(searchTerm.toLowerCase()) || tp.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'All' || tp.type === filterType;
        return matchSearch && matchType;
    });

    const selectedTp = touchpoints.find(tp => tp.id === selectedTpId);

    // Real-Daten Verknüpfungen
    const getLinkedCampaigns = (tpId) => {
        return campaigns.filter(c => c.touchpointIds && c.touchpointIds.includes(tpId));
    };

    const getLinkedContent = (tpId) => {
        return content.filter(c => c.touchpointId === tpId);
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">🔗 Kanäle & Touchpoints</h1>
                    <p className="page-subtitle">Die zentrale Bibliothek aller Berührungspunkte mit den Zielgruppen</p>
                </div>
                <div className="page-header-actions">
                    <PageHelp title="Touchpoints">
                        <p style={{ marginBottom: '12px' }}>Hier verwaltest du alle Kanäle (Paid, Owned, Earned), auf denen ihr mit potenziellen Kunden interagiert.</p>
                        <ul className="help-list">
                            <li><strong>Touchpoint-Architektur:</strong> Anstatt Kanäle als Freitext in jede Kampagne zu schreiben, pflegen wir eine Single-Source-of-Truth.</li>
                            <li><strong>Dynamische Verknüpfung:</strong> Du siehst in Echtzeit, welche Kampagnen und welcher Content über diesen spezifischen Kanal ausgespielt werden.</li>
                        </ul>
                    </PageHelp>

                    {canEdit && (
                        <button className="btn btn-primary">
                            <Plus size={16} /> Neuer Kanal
                        </button>
                    )}
                </div>
            </div>

            {/* Filter-Leiste */}
            <div className="filters-bar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Touchpoint suchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <select
                    className="form-input"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="All">Alle Typen</option>
                    {Array.from(new Set(touchpoints.map(tp => tp.type))).map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedTp ? '1fr 400px' : '1fr', gap: '20px', alignItems: 'start' }}>

                {/* Touchpoints Liste */}
                <div style={{ display: 'grid', gridTemplateColumns: selectedTp ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    {filtered.map(tp => {
                        const isSelected = selectedTpId === tp.id;
                        return (
                            <div
                                key={tp.id}
                                className="card"
                                onClick={() => setSelectedTpId(isSelected ? null : tp.id)}
                                style={{
                                    padding: '20px',
                                    cursor: 'pointer',
                                    borderColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, margin: 0 }}>{tp.name}</h3>
                                    <span className={`badge ${tp.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                                        {tp.status === 'active' ? 'Aktiv' : 'Geplant'}
                                    </span>
                                </div>

                                <span className={`badge ${TYPE_COLORS[tp.type] || 'badge-default'}`} style={{ alignSelf: 'flex-start' }}>
                                    {tp.type}
                                </span>

                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                    {tp.description}
                                </p>

                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                    <LinkIcon size={12} /> {tp.url}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Detail Panel */}
                {selectedTp && (
                    <div className="card animate-in" style={{ position: 'sticky', top: '24px', padding: '0', display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--color-primary)' }}>

                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, margin: 0 }}>{selectedTp.name}</h2>
                                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelectedTpId(null)}>×</button>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0, marginBottom: '16px' }}>
                                {selectedTp.description}
                            </p>

                            <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--font-size-xs)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.65rem' }}>Typ</span>
                                    <span className={`badge ${TYPE_COLORS[selectedTp.type] || 'badge-default'}`}>{selectedTp.type}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.65rem' }}>URL</span>
                                    <span style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>{selectedTp.url}</span>
                                </div>
                            </div>
                        </div>

                        {/* Abhängigkeiten & Verknüpfungen */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-elevated)', flex: 1 }}>

                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Megaphone size={14} /> Zugeordnete Kampagnen
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {getLinkedCampaigns(selectedTp.id).map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => navigate(`/campaigns/${c.id}`)}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                                        >
                                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{c.name}</span>
                                            <ExternalLink size={12} style={{ color: 'var(--color-primary)' }} />
                                        </div>
                                    ))}
                                    {getLinkedCampaigns(selectedTp.id).length === 0 && (
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', padding: '10px', background: 'white', borderRadius: '4px', border: '1px dashed var(--border-color)' }}>Keine Kampagnen verknüpft.</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ListTodo size={14} /> Content & Assets
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {getLinkedContent(selectedTp.id).map(c => (
                                        <div
                                            key={c.id}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{c.title}</span>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{c.platform}</span>
                                            </div>
                                            <span className="badge badge-primary" style={{ fontSize: '0.55rem' }}>{c.status}</span>
                                        </div>
                                    ))}
                                    {getLinkedContent(selectedTp.id).length === 0 && (
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', padding: '10px', background: 'white', borderRadius: '4px', border: '1px dashed var(--border-color)' }}>Kein Content hinterlegt.</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
