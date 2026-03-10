import { useState } from 'react';
import {
    HelpCircle, LayoutDashboard, Target, Users2, Megaphone,
    Calendar, CheckSquare, Wallet, Settings, CheckCircle,
    FileText, Lightbulb, UserCheck, Search, Image as ImageIcon,
    MessageSquare, AlertTriangle, Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PlaceholderImage = ({ title, icon: Icon, color, description }) => (
    <div style={{
        background: 'var(--bg-hover)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '280px', color: 'var(--text-tertiary)', marginBottom: '24px', position: 'relative', overflow: 'hidden',
        padding: '24px', textAlign: 'center'
    }}>
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: color || 'var(--color-primary)'
        }} />
        <Icon size={48} style={{ marginBottom: '16px', opacity: 0.5, color: color || 'var(--text-tertiary)' }} />
        <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>📸 Screenshot Platzhalter</div>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</div>
        {description && <div style={{ fontSize: 'var(--font-size-xs)', maxWidth: '400px', lineHeight: 1.5 }}>{description}</div>}
    </div>
);

const SectionTitle = ({ icon: Icon, title, color }) => (
    <h3 style={{
        fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px', marginTop: '48px'
    }}>
        <div style={{ background: `${color}15`, padding: '8px', borderRadius: '8px', color: color, display: 'flex' }}>
            <Icon size={24} />
        </div>
        {title}
    </h3>
);

const TipBox = ({ title, children }) => (
    <div style={{
        padding: '16px', background: 'rgba(56, 189, 248, 0.08)', borderLeft: '4px solid #38bdf8',
        borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: 'var(--font-size-sm)'
    }}>
        <div style={{ fontWeight: 600, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lightbulb size={16} /> {title}
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{children}</div>
    </div>
);

export default function ManualPage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState(currentUser?.role || 'admin');

    const tabs = [
        { id: 'admin', label: 'Admin (Strategie & Setup)' },
        { id: 'manager', label: 'Manager (Planung & Steuerung)' },
        { id: 'member', label: 'Member (Umsetzung)' }
    ];

    return (
        <div className="animate-in">
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <div className="page-header-left">
                    <h1 className="page-title">Handbuch & Workflow Guide</h1>
                    <p className="page-subtitle">Die vollumfängliche Anleitung zur optimalen Nutzung des Marketing Powerhouse.</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '32px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ flex: 1, padding: '12px', fontSize: 'var(--font-size-md)' }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ═══ ADMIN WORKFLOW ═══ */}
                {activeTab === 'admin' && (
                    <div className="animate-in" style={{ animation: 'fadeIn 0.3s' }}>
                        <div style={{ marginBottom: '32px', padding: '24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Einleitung: Die Admin-Rolle</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-md)' }}>
                                Als <strong>Administrator</strong> trägst du die Verantwortung für das grundlegende Setup und die strategische DNA des Systems.
                                Du definierst die Markenwerte, verwaltest das Team und dessen Zugriffsrechte und konfigurierst die System-Schnittstellen (APIs).
                                Nur wenn dein Setup detailliert und präzise ist, können Manager und Members effizient und markenkonform arbeiten.
                            </p>
                        </div>

                        <SectionTitle icon={Target} title="Die Digitale Positionierung pflegen" color="#6366f1" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Die "Digitale Positionierung" (im Menü unter "Unternehmen") ist das Gehirn der App. Die hier eingegebenen Daten werden genutzt, um Content-Ideen zu generieren und Kampagnen auszurichten.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>DNA & Pitch:</strong> Definiere hier, wofür das Unternehmen in einem Satz steht.</li>
                                <li><strong>Pain Points & USPs:</strong> Die größten Schmerzpunkte der Zielgruppe und die Alleinstellungsmerkmale deines Unternehmens. Diese müssen messerscharf formuliert sein.</li>
                                <li><strong>Keywords:</strong> Relevante Begriffe, die in Kampagnen und im SEO genutzt werden sollen.</li>
                                <li><strong>Tone of Voice:</strong> Wie sprecht ihr mit der Zielgruppe? (z.B. informativ, per Du, auf Augenhöhe).</li>
                            </ul>
                        </div>
                        <TipBox title="Best Practice: Positionierung">
                            Halte die DNA so prägnant wie möglich. Vermeide Marketing-Floskeln. Die KI-Anbindungen (falls aktiv) und die Briefings der Manager ziehen sich exakt diese Daten, um Texte und Creatives vorzuschlagen.
                        </TipBox>
                        <PlaceholderImage
                            title="Digitale Positionierung bearbeiten" icon={Target} color="#6366f1"
                            description="Zeigt das Formular mit den Feldern für DNA, USPs, Tone-of-Voice im Edit-Modus."
                        />

                        <SectionTitle icon={Settings} title="Systemeinstellungen & KI-Integrationen" color="#8b5cf6" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Unter "Einstellungen" managst du globale Parameter, Notifications und vor allem die API-Anbindungen.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>Firmenprofil:</strong> Ändere den Namen und das globale Branding.</li>
                                <li><strong>Integrationen:</strong> Hier hinterlegst du in Zukunft API-Keys für OpenAI, Meta Ads, Google Analytics oder LinkedIn. Diese Keys werden systemweit verschlüsselt genutzt.</li>
                                <li><strong>Benachrichtigungen:</strong> Lege fest, ob das System bei neuen Kampagnen oder kritischen Budget-Grenzen Warnmails versendet.</li>
                            </ul>
                        </div>
                        <PlaceholderImage
                            title="Einstellungs-Dashboard" icon={Settings} color="#8b5cf6"
                            description="Zeigt den Tab 'Integrationen' mit leeren/verborgenen API-Key Eingabefeldern für externe Plattformen."
                        />

                        <SectionTitle icon={Users2} title="Benutzerverwaltung & Berechtigungen" color="#ec4899" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Im Tab "Team" oder "Benutzerverwaltung" (innerhalb der Einstellungen) hast du als einziger die Macht, das Rollenkonzept zu steuern.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Neuen Mitarbeitern musst du initial eine Rolle zuweisen. Standardmäßig sind neue Accounts "Member".</li>
                                <li><strong>Manager:</strong> Dürfen Kampagnen, Zielgruppen und Budgets erstellen und verwalten.</li>
                                <li><strong>Member:</strong> Können nur Aufgaben sehen und abarbeiten. Sie sehen keine Budgets oder Einstellungen.</li>
                            </ul>
                        </div>
                        <TipBox title="Sicherheit">
                            Befördere Nutzer nur zum Admin, wenn sie wirklich globale Systemeinstellungen (wie API-Keys) ändern dürfen. In 90% der Fälle ist die Manager-Rolle für Teamleiter völlig ausreichend.
                        </TipBox>
                    </div>
                )}

                {/* ═══ MANAGER WORKFLOW ═══ */}
                {activeTab === 'manager' && (
                    <div className="animate-in" style={{ animation: 'fadeIn 0.3s' }}>
                        <div style={{ marginBottom: '32px', padding: '24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Einleitung: Die Manager-Rolle</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-md)' }}>
                                Als <strong>Manager</strong> bist du der Taktgeber des Marketing-Teams. Du entwirfst <strong>Zielgruppen</strong>, formst
                                <strong>Kampagnen</strong>, steuerst das <strong>Budget</strong> und befüllst den <strong>Content-Kalender</strong>.
                                Du behältst die Deadlines im Auge und delegierst konkrete <strong>Aufgaben</strong> an die Members, die dann die visuelle und textliche Umsetzung übernehmen.
                            </p>
                        </div>

                        <SectionTitle icon={Users2} title="1. Zielgruppen (Personas) anlegen" color="#10b981" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Bevor eine Kampagne startet, musst du wissen, wen sie ansprechen soll. Unter "Marketing &gt; Zielgruppen" verwaltest du Buyer Personas.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Pflege Demografie, Branche und Jobtitel detailliert ein.</li>
                                <li>Definiere die <strong>Wünsche & Ziele</strong> sowie die <strong>Frustrationen</strong> der Persona, da diese als direkte Vorlage für Anzeigentexte (Ad Copy) dienen.</li>
                                <li>Verknüpfe am Ende eine Zielgruppe fest mit einer neuen Kampagne.</li>
                            </ul>
                        </div>
                        <PlaceholderImage
                            title="Zielgruppen-Detailansicht" icon={Users2} color="#10b981"
                            description="Zeigt die Karteikarte einer Buyer Persona mit deren Zielen und Frustrationen."
                        />

                        <SectionTitle icon={Megaphone} title="2. Kampagnen orchestrieren" color="#10b981" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Kampagnen sind das Herzstück. Hier laufen Budgets, Content und Performance-Daten zusammen.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>Erstellung:</strong> Klicke auf "Neue Kampagne". Setze Start-/Enddatum, Zielsetzung (Brand Awareness, Lead Gen) und weise Zielgruppen zu.</li>
                                <li><strong>Detailansicht:</strong> Öffne eine laufende Kampagne. Du siehst nun ein Dashboard mit vier Reitern: Übersicht, Creatives & Aufgaben, Content, Performance.</li>
                                <li>Nutze die Kampagnenansicht, um exakt für dieses Thema neuen Content und neue Aufträge an dein Team zu kreieren.</li>
                            </ul>
                        </div>
                        <TipBox title="Kampagnen-Fokus">
                            Kampagnen können Plattform-übergreifend sein. Du kannst z.B. eine "Q3 Webinar" Kampagne anlegen und darunter Content für E-Mail, LinkedIn und Google Ads bündeln.
                        </TipBox>

                        <SectionTitle icon={Map} title="3. Customer Journey & Touchpoints planen" color="#ec4899" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Kampagnen und Zielgruppen entfalten ihre volle Wirkung erst, wenn sie an den richtigen Orten (Touchpoints) zur richtigen Zeit in der richtigen Phase zusammentreffen.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>Touchpoints:</strong> Unter "Kanäle & Touchpoints" pflegst du die Single-Source-of-Truth eurer Marketingwege. (z.B. Google Link, Social Media Page, Sales-Telefonnummer). Gehe sicher, dass diese aktuell sind.</li>
                                <li><strong>Customer Journey (ASIDAS):</strong> Unter "Customer Journey" verknüpfst du diese Touchpoints mit den psychologischen Phasen eurer Personas. Ihr nutzt das moderne ASIDAS Modell (Attention, Search, Interest, Desire, Action, Share).</li>
                                <li>Die Matrix hilft dir zu erkennen, ob eure Kampagnen-Inhalte tatsächlich die Pain Points der User lösen und auf welchen Touchpoints ihr Content publizieren müsst.</li>
                            </ul>
                        </div>
                        <PlaceholderImage
                            title="Customer Journey Board" icon={Map} color="#ec4899"
                            description="Zeigt das ASIDAS-Board mit den verlinkten Touchpoints und den Emotionen der Zielgruppe in jeder Phase."
                        />

                        <SectionTitle icon={Calendar} title="4. Content-Kalender & Redaktionsplanung" color="#f59e0b" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Der Content-Kanal ist dein Redaktionsplan. Er bündelt alle Beiträge über alle Plattformen in einer Kalender- und Listenansicht.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>Content planen:</strong> Klicke auf "Content planen" oben rechts. Wähle Datum, Plattform (LinkedIn, Blog, etc.) und hänge den Content an eine Kampagne an (optional).</li>
                                <li><strong>🚨 Kritischer Schritt - Aufgabenhüllen erstellen:</strong> Ein reiner Kalendereintrag (Idee) bedeutet noch nicht, dass jemand daran arbeitet! Wenn du Content erstellst, setze den Haken bei <strong>"Aufgabenhülle erstellen"</strong>.</li>
                                <li><strong>Warnsystem:</strong> Content ohne verknüpfte Aufgabe erscheint im Kalender <strong style={{ color: '#ef4444' }}>rot markiert</strong> und mit einem Warn-Icon. So siehst du sofort, wo du noch ein Team-Mitglied briefen musst.</li>
                            </ul>
                        </div>
                        <PlaceholderImage
                            title="Content-Kalender mit roten Warnungen" icon={Calendar} color="#f59e0b"
                            description="Zeigt den Monatskalender. Manche Einträge sind sauber farbig, manche leuchten rot wegen fehlenden Aufgaben."
                        />

                        <SectionTitle icon={CheckSquare} title="5. Aufgaben-Delegation (Das Briefing)" color="#f59e0b" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Wenn der Content feststeht, musst du der Umsetzung (den Members) genau erklären, was zu tun ist.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Gehe auf die Registerkarte "Aufgaben" oder wähle eine Aufgabe direkt aus der Kampagnen/Content-Ansicht.</li>
                                <li>Öffne das Aufgaben-DetailModal. Weise die Aufgabe über das Dropdown "Zugewiesen an:" einem Member zu.</li>
                                <li>Befülle die <strong>Beschreibung</strong> mit einem genauen Briefing. (Was für Bilder? Welcher Text? Welche Deadline?).</li>
                                <li>Sobald die Aufgabe den Status "Draft" (Entwurf) verlässt und auf "To Do" springt, sieht das Member die Aufgabe auf seinem Dashboard.</li>
                            </ul>
                        </div>

                        <SectionTitle icon={Wallet} title="6. Budget & Controlling" color="#3b82f6" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Als Manager musst du die Kosten im Blick behalten. Die Budget-Ansicht hilft dir dabei.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Dort siehst du den Forecast ("Plan") vs. die tatsächlichen "Ist"-Kosten.</li>
                                <li><strong>Transparenz:</strong> Klicke auf "Ausgabe erfassen", um Tools (Abo-Kosten) oder Freelancer-Rechnungen manuell zum System hinzuzufügen, falls es keine direkte API-Anbindung gibt.</li>
                                <li>Das System warnt dich, wenn eine Kampagne zu nah an das veranschlagte Budget-Limit gerät.</li>
                            </ul>
                        </div>
                        <TipBox title="Members und Budgets">
                            Keine Sorge um sensible Daten: Accounts mit der Rolle "Member" haben keinerlei Zugriff auf die Navigation "Budget & Controlling".
                        </TipBox>
                        <PlaceholderImage
                            title="Budget-Dashboard Plan vs Ist" icon={Wallet} color="#3b82f6"
                            description="Zeigt ein Balkendiagramm mit blauen (Plan) und türkisen (Ist) Balken und Kostenverteilungs-Kuchen."
                        />
                    </div>
                )}

                {/* ═══ MEMBER WORKFLOW ═══ */}
                {activeTab === 'member' && (
                    <div className="animate-in" style={{ animation: 'fadeIn 0.3s' }}>
                        <div style={{ marginBottom: '32px', padding: '24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Einleitung: Die Member-Rolle</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-md)' }}>
                                Als <strong>Member</strong> (z.B. Creator, Texter, Designer) liegt dein absoluter Fokus auf der <strong>kreativen Umsetzung</strong>.
                                Du wirst nicht durch schwerfällige Strategie-Fenster oder Budget-Zahlen abgelenkt.
                                Dein täglicher Workflow besteht aus: Dashboard checken, Briefing lesen, Aufgabe abarbeiten, Dateien ablegen und Status aktualisieren.
                            </p>
                        </div>

                        <SectionTitle icon={LayoutDashboard} title="1. Der Start in den Tag: Das Dashboard" color="#f59e0b" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Dein erster Klick führt dich auf das <strong>Dashboard</strong>.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Hier hast du das Panel <strong>"Meine Aufgabenliste"</strong>. Dort landen alle Tickets, die dir von Managern zugewiesen wurden.</li>
                                <li>Aufgaben, die für heute oder morgen fällig sind, springen dir sofort in der Deadline-Übersicht ins Auge.</li>
                            </ul>
                        </div>
                        <PlaceholderImage
                            title="Dein Persönliches Dashboard" icon={LayoutDashboard} color="#f59e0b"
                            description="Zeigt die Dashboard-Startseite mit Fokus auf die Tabelle 'Meine letzten Tasks' und offene Tickets."
                        />

                        <SectionTitle icon={FileText} title="2. Das Briefing lesen" color="#ec4899" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Klicke in der Liste oder auf dem Kanban-Board auf eine Aufgabe, um das <strong>Aufgaben-Details Modal</strong> zu öffnen.</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>In der Mitte liest du die ausführliche <strong>Beschreibung</strong> des Managers. Das ist dein Arbeitsauftrag.</li>
                                <li><strong>Kontext:</strong> Oftmals hängt eine Aufgabe an einem übergeordneten Content-Plan. Unter der Sektion <strong>"Zugehöriger Content"</strong> siehst du sofort, ob dieser Post z.B. für Instagram oder LinkedIn gedacht ist und an welchem Tag es veröffentlicht wird.</li>
                                <li>Mit einem Klick auf den verlinkten Content oder die verlinkte Kampagne kannst du dir weiteres Hintergrundwissen holen.</li>
                            </ul>
                        </div>
                        <TipBox title="Bei Unklarheiten">
                            Wenn das Briefing in der Beschreibung nicht eindeutig ist, setze den Status auf "Blocked / Fehler" und schreib in dem Fall den Manager über Teams/Slack an.
                        </TipBox>

                        <SectionTitle icon={LinkIcon} title="3. Umsetzung & OneDrive Link eintragen" color="#ec4899" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Du produzierst nun das Video, das Bild oder schreibst den Copy-Text. Da die App absichtlich keine Filespeicherung betreibt (um Speicherplatzkosten zu sparen), passiert die Dateiablage bei euch extern:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Lege das fertige Creative (als PNG, MP4, PDF) auf eurem Firmen-Speicher (z.B. Microsoft OneDrive, Google Drive, SharePoint) in den korrekten Kundenordner.</li>
                                <li>Kopiere dort den Freigabe-Link (Share-Link).</li>
                                <li>Gehe in der App wieder in die Aufgabe rein. Klicke auf <strong>"Bearbeiten"</strong>.</li>
                                <li>Füge den Link unten bei <strong>"Ressourcen Link (OneDrive / Drive)"</strong> ein und speichere.</li>
                            </ul>
                            <p>Jetzt hat der Manager sofortigen Zugriff auf die finale hochauflösende Datei, ohne danach suchen zu müssen.</p>
                        </div>
                        <PlaceholderImage
                            title="Aufgaben-Ansicht: Dateiverlinkung" icon={LinkIcon} color="#ec4899"
                            description="Skizziert das geöffnete Aufgaben-Fenster, besonders den Eingabebereich für den OneDrive Link."
                        />

                        <SectionTitle icon={CheckSquare} title="4. Den Kanban-Status pflegen" color="#14b8a6" />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            <p style={{ marginBottom: '16px' }}>Status-Hygiene ist das wichtigste in der Zusammenarbeit. Das Marketing Powerhouse arbeitet mit einem 5-Spalten-Kanban (auf der Seite "Aufgaben").</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>To Do:</strong> Hier liegt alles, was du noch anfangen musst.</li>
                                <li><strong>In Progress:</strong> Wechsle den Status hierauf, sobald du anfängst zu bearbeiten. So weiß der Manager: "Ah, da ist er dran".</li>
                                <li><strong>In Review:</strong> Du hast den OneDrive-Link hinzugefügt und dein Creative ist fertig? Setze den Status auf In Review. Das ist das Zeichen für den Manager, deine Arbeit freizugeben.</li>
                                <li><strong>Done:</strong> Sobald der Manager sein OK gegeben hat (oder der Content publiziert ist), wandert das Ticket auf "Done". Das macht primär der Manager, aber auch du kannst Tickets abschließen.</li>
                            </ul>
                        </div>
                        <PlaceholderImage
                            title="Das Kanban-Board" icon={CheckSquare} color="#14b8a6"
                            description="Zeigt das Aufgaben-Board mit den Spalten 'To Do', 'In Bearbeitung', etc. und den verschiebbaren Aufgabenkarten."
                        />

                    </div>
                )}
            </div>
        </div>
    );
}
