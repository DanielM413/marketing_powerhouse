import { useState } from 'react';
import { Plus, Search, Users, Target, Megaphone, ChevronRight, Tag, MapPin, Briefcase, Heart } from 'lucide-react';
import { audiences, campaigns } from '../data/mockData';
import PageHelp from '../components/PageHelp';
import AudienceDetailModal from '../components/AudienceDetailModal';

const segmentConfig = {
    'B2C': { badge: 'badge-info', label: 'B2C' },
    'B2B': { badge: 'badge-primary', label: 'B2B' },
};

const typeConfig = {
    'buyer': { label: 'Buyer Persona', icon: '🎯' },
    'user': { label: 'User Persona', icon: '🧑‍💻' },
};

export default function AudiencesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('all');
    const [selectedAudience, setSelectedAudience] = useState(null);
    const [showNewAudienceModal, setShowNewAudienceModal] = useState(false);

    const filtered = audiences
        .filter(a => segmentFilter === 'all' || a.segment === segmentFilter)
        .filter(a =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const getLinkedCampaigns = (audienceId) =>
        campaigns.filter(c => c.targetAudiences?.includes(audienceId));

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Zielgruppen & Avatare</h1>
                    <p className="page-subtitle">
                        {audiences.length} Personas definiert · {audiences.filter(a => a.segment === 'B2B').length} B2B · {audiences.filter(a => a.segment === 'B2C').length} B2C
                    </p>
                </div>
                <div className="page-header-actions">
                    <PageHelp title="Zielgruppen & Avatare">
                        <p style={{ marginBottom: '12px' }}>Werbt nicht ins Leere. Ohne klare Zielgruppen ist jedes Budget vergeudet. Erstelle hier eure Traumkunden.</p>
                        <ul className="help-list">
                            <li><strong>Personas anlegen:</strong> Generiere "Buyer Personas" (Käufer) oder "User Personas" (Nutzer) basierend auf echten demografischen Daten.</li>
                            <li><strong>Schmerzpunkte (Pain Points):</strong> Das wichtigste Feld! Formuliere extrem genau, welche Alltagsprobleme die Persona hat, damit eure Ads genau in diese Wunde treffen können.</li>
                            <li><strong>Ziele:</strong> Was will die Persona erreichen? Das wird euer Angebot.</li>
                            <li><strong>Kampagnen-Kopplung:</strong> Wenn du auf eine Persona klickst, siehst du rechts im Detail-Reiter, in welchen aktuellen Kampagnen diese Person zielgenau beworben wird.</li>
                        </ul>
                    </PageHelp>
                    <button className="btn btn-primary" onClick={() => setShowNewAudienceModal(true)}>
                        <Plus size={16} />
                        Neue Persona
                    </button>
                </div>
            </div>

            {/* Filter & Search */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Personas durchsuchen…"
                        style={{ paddingLeft: '36px', width: '100%' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                    {[
                        { key: 'all', label: 'Alle' },
                        { key: 'B2B', label: 'B2B' },
                        { key: 'B2C', label: 'B2C' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`tab ${segmentFilter === tab.key ? 'active' : ''}`}
                            onClick={() => setSegmentFilter(tab.key)}
                            style={{
                                borderBottom: 'none',
                                borderRadius: 'var(--radius-sm)',
                                padding: '6px 16px',
                                background: segmentFilter === tab.key ? 'var(--bg-hover)' : 'transparent',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            
                {/* Personas Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    {filtered.map(audience => {
                        const linkedCampaigns = getLinkedCampaigns(audience.id);
                        const isSelected = selectedAudience?.id === audience.id;
                        return (
                            <div
                                key={audience.id}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    padding: '20px',
                                    borderColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                }}
                                onClick={() => setSelectedAudience(isSelected ? null : audience)}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                    <div className="persona-avatar" style={{ background: audience.color }}>
                                        {audience.initials}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{audience.name}</h3>
                                            <span className={`badge ${segmentConfig[audience.segment].badge}`}>{audience.segment}</span>
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                                {typeConfig[audience.type].icon} {typeConfig[audience.type].label}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            {audience.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Info Row */}
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={11} /> {audience.age} J.
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={11} /> {audience.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Briefcase size={11} /> {audience.jobTitle}
                                    </span>
                                </div>

                                {/* Interests */}
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                    {audience.interests.slice(0, 3).map(interest => (
                                        <span key={interest} className="keyword-tag keyword-tag--read">
                                            {interest}
                                        </span>
                                    ))}
                                    {audience.interests.length > 3 && (
                                        <span className="keyword-tag keyword-tag--read" style={{ color: 'var(--text-tertiary)' }}>
                                            +{audience.interests.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '12px',
                                    borderTop: '1px solid var(--border-color)',
                                    fontSize: 'var(--font-size-xs)',
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)' }}>
                                        <Megaphone size={11} />
                                        {linkedCampaigns.length} Kampagne{linkedCampaigns.length !== 1 ? 'n' : ''}
                                    </span>
                                    <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                        Details <ChevronRight size={12} />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                            {/* Detail Modal */}
            {selectedAudience && (
                <AudienceDetailModal
                    audience={selectedAudience}
                    onClose={() => setSelectedAudience(null)}
                />
            )}

            {/* New Audience Modal */}
            {showNewAudienceModal && (
                <div className="modal-overlay" onClick={() => setShowNewAudienceModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Neue Persona erstellen</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowNewAudienceModal(false)}>✕</button>
                        </div>
                        <div className="modal-body" style={{ overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Persona-Name</label>
                                    <input type="text" className="form-input" placeholder="z.B. Digital Dave" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Typ</label>
                                    <select className="form-input">
                                        <option value="buyer">Buyer Persona</option>
                                        <option value="user">User Persona</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Segment</label>
                                    <select className="form-input">
                                        <option value="B2C">B2C</option>
                                        <option value="B2B">B2B</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Altersgruppe</label>
                                    <input type="text" className="form-input" placeholder="z.B. 28–38" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Standort</label>
                                    <input type="text" className="form-input" placeholder="z.B. DACH-Region" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Berufsfeld / Job Title</label>
                                    <input type="text" className="form-input" placeholder="z.B. Marketing Manager" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Geschlecht</label>
                                    <input type="text" className="form-input" placeholder="z.B. Weiblich, Divers" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Einkommen</label>
                                    <input type="text" className="form-input" placeholder="z.B. Mittel–Hoch" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bildung</label>
                                    <input type="text" className="form-input" placeholder="z.B. Master" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Customer Journey Phase</label>
                                    <select className="form-input">
                                        <option value="Awareness">Awareness</option>
                                        <option value="Consideration">Consideration</option>
                                        <option value="Purchase">Purchase</option>
                                        <option value="Retention">Retention</option>
                                        <option value="Advocacy">Advocacy</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Bevorzugte Kanäle (kommagetrennt)</label>
                                    <input type="text" className="form-input" placeholder="z.B. LinkedIn, Magazin, Podcast" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Entscheidungsprozess</label>
                                    <textarea className="form-input form-textarea" placeholder="Wie trifft diese Persona Kaufentscheidungen?..." style={{ minHeight: '60px' }} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Beschreibung</label>
                                    <textarea className="form-input form-textarea" placeholder="Beschreibe diese Persona in 2–3 Sätzen…" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Pain Points (kommagetrennt)</label>
                                    <input type="text" className="form-input" placeholder="z.B. Zu viele Tools, Zeitmangel, …" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Ziele (kommagetrennt)</label>
                                    <input type="text" className="form-input" placeholder="z.B. Produktivität steigern, …" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowNewAudienceModal(false)}>Abbrechen</button>
                            <button className="btn btn-primary" onClick={() => setShowNewAudienceModal(false)}>Persona erstellen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
