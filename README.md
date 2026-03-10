# 🚀 Marketing Powerhouse

Eine **SaaS-Plattform zur Unterstützung und Automatisierung von Marketingprozessen**. Marketing Powerhouse vereint Kampagnen-Management, Content-Planung, Budget-Kontrolle und Team-Zusammenarbeit in einer DSGVO-konformen, europäischen Lösung.

![Version](https://img.shields.io/badge/version-0.6.1-blue)
![Status](https://img.shields.io/badge/status-Phase%200.5-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Features

✅ **Kampagnen-Management** — Multi-Channel Kampagnen verwalten mit Master-Prompts, Zielgruppen und Keywords-System  
✅ **Customer Journey Mapping** — ASIDAS-Funnel mit Content-Verknüpfung und Deep-Linking  
✅ **Kanäle & Touchpoints** — Single-Source-of-Truth für alle Marketing-Kanäle mit bidirektionaler Analyse  
✅ **Content-Kalender** — Visuelle Planung mit 6-stufigem Status-Workflow  
✅ **Zielgruppen-Management** — Persona-Avatare, Segment-Filter, Journey-Integration  
✅ **Aufgaben & Creatives** — Einheitlicher 10-stufiger Creative-Workflow  
✅ **Budget & Controlling** — Rollenbasierte Budget-Einsicht mit KPI-Tracking  
✅ **Rollenbasierte Access Control (RBAC)** — Admin, Manager, Member mit spezifischen Berechtigungen  
✅ **Dark Theme** — Modernes Design-System mit CSS Custom Properties  

---

## 🚀 Quick Start

### Anforderungen
- Node.js 18+
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd Marketing_powerhouse

# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Server läuft unter: **http://localhost:5173**

---

## 👥 Test-Accounts

Zum Testen verschiedener Rollen verwenden Sie diese Accounts:

| Rolle | E-Mail | Passwort | Abteilung |
|---|---|---|---|
| 🔴 Admin | `admin@marketing-ph.de` | `admin123` | IT & Operations |
| 🟣 Manager | `sarah@marketing-ph.de` | `manager123` | Marketing |
| 🟢 Member | `lisa@marketing-ph.de` | `member123` | Marketing (Content) |

**Hinweis:** Ein Dev-Panel auf der Login-Seite erlaubt Schnellzugang zu allen Test-Accounts.

---

## 📁 Projektstruktur

```
Marketing_powerhouse/
├── src/
│   ├── App.jsx                    # Router & Auth-Provider
│   ├── index.css                  # Design System
│   ├── components/                # Wiederverwendbare Komponenten
│   │   ├── Sidebar.jsx            # Navigation mit Rollen-Filterung
│   │   ├── Header.jsx             # Benutzer-Info & Rollen-Badge
│   │   └── ...
│   ├── pages/                     # Route-Seiten
│   │   ├── DashboardPage.jsx
│   │   ├── CampaignsPage.jsx
│   │   ├── AudiencesPage.jsx
│   │   ├── CustomerJourneyPage.jsx
│   │   ├── TouchpointsPage.jsx    # NEU: Kanäle & Touchpoints
│   │   ├── ContentCalendarPage.jsx
│   │   ├── BudgetPage.jsx
│   │   ├── TasksPage.jsx
│   │   ├── PositioningPage.jsx
│   │   └── ...
│   ├── context/                   # State Management
│   │   ├── AuthContext.jsx        # RBAC & Current User
│   │   ├── TaskContext.jsx        # Aufgaben-State
│   │   └── ContentContext.jsx     # Content-State
│   └── data/
│       └── mockData.js            # Testdaten
├── KONZEPT.md                     # Ausführliche Dokumentation
├── package.json
└── vite.config.js
```

---

## 🔐 Rollenmodell

### Rollen & Berechtigungen

| Berechtigung | Admin | Manager | Member |
|---|:---:|:---:|:---:|
| **Kampagnen erstellen** | ✅ | ✅ | ❌ |
| **Zielgruppen bearbeiten** | ✅ | ✅ | ❌ |
| **Budget einsehen** | ✅ | ✅ | ❌ |
| **Positionierung bearbeiten** | ✅ | ❌ | ❌ |
| **Benutzerverwaltung** | ✅ | ❌ | ❌ |
| **Aufgaben zuweisen** | ✅ | ✅ | ❌ |
| **Eigene Aufgaben bearbeiten** | ✅ | ✅ | ✅ |

Detaillierte Berechtigungs-Matrix in [KONZEPT.md](KONZEPT.md#-rollen--berechtigungen-rbac)

---

## 📚 Navigation Struktur

Die Sidebar ist in folgende Bereiche unterteilt:

**Übersicht**
- Dashboard

**Marketing**
- Kampagnen
- Zielgruppen
- Customer Journey
- **Kanäle & Touchpoints** ← NEU
- Content-Übersicht
- Content-Kalender
- Budget & Controlling

**Team**
- Aufgaben
- Berichte (bald)

**Unternehmen**
- Digitale Positionierung

**System**
- Anleitung
- Einstellungen

---

## 🔧 Technologie-Stack

| Layer | Technologie | Version |
|---|---|---|
| **Frontend Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.3.1 |
| **Router** | React Router | 7.13.1 |
| **State Management** | React Context API | — |
| **Styling** | Vanilla CSS | — |
| **UI Components** | Lucide React | 0.577.0 |
| **Charts** | Recharts | 3.8.0 |
| **Linting** | ESLint | 9.39.1 |

---

## 📝 Verfügbare Scripts

```bash
# Development Server
npm run dev

# Production Build
npm run build

# Preview Build
npm run preview

# Linting
npm run lint
```

---

## 🎨 Design-System

Marketing Powerhouse verwendet ein umfassendes CSS-basiertes Design-System:

- **Dark Theme** mit branding-konformen Farben
- **CSS Custom Properties** für zentrale Verwaltung (Farben, Spacing, Typografie)
- **Komponenten-Klassen** für Buttons, Cards, Stats, Modals, Kanban, etc.
- **Responsive** (Desktop optimiert, Tablet in Progress)
- **Animationen** (fadeIn, slideUp, slideInRight)

Siehe [src/index.css](src/index.css) for vollständiges Design System.

---

## 🗂️ Datenmodell

Das System verwendet ein flexibles Mock-Datenmodell in `src/data/mockData.js`:

- **Users** — Testnutzer mit Rollen (admin, manager, member)
- **Campaigns** — Marketing-Kampagnen mit Multi-Channel-Support
- **Audiences/Personas** — Zielgruppen mit Segmentierung (B2B/B2C)
- **Content** — Redaktionell geplanter Content mit 6-stufigem Status
- **Tasks/Creatives** — Aufgaben mit 10-stufigem Workflow
- **Budget Entries** — Budget-Tracking und KPI-Management
- **Touchpoints** — Marketing-Kanäle (Paid, Owned, Earned, Direct)
- **Company Positioning** — Unternehmens-DNA, Vision, Mission, Keywords

Detailliertes Datenmodell siehe [KONZEPT.md § 7](KONZEPT.md#7-datenmodell-mock--mockdatajs)

---

## 🚧 In Development

### Phase 0.5 (Aktuell)
- ✅ Kanäle & Touchpoints Navigation
- 🔄 Responsive Design (Tablet)
- 🔄 Drag & Drop (Kanban, Kalender)

### Phase 1 (Nächst)
- 🔜 Supabase Backend Integration
- 🔜 Row Level Security (RLS)
- 🔜 Echte Authentifizierung

### Phase 2
- 🔜 E-Mail-Benachrichtigungen
- 🔜 Real-time Updates
- 🔜 Echtzeit-Budget-Tracking

### Phase 3
- 🔜 KI-Content-Generation (OpenAI/Anthropic)
- 🔜 Keyword-Analyse & -Empfehlungen
- 🔜 Automatische Performance-Insights

---

## 📖 Dokumentation

- **[KONZEPT.md](KONZEPT.md)** — Ausführliche technische Dokumentation, Roadmap, Datenmodell
- **In-App Help** — Kontextuelle Hilfe auf jeder Seite via PageHelp-Komponente
- **Dev-Login Panel** — Schneller Zugang zu Test-Accounts

---

## 🤝 Support

Für Fragen oder Probleme:
1. Konsultieren Sie [KONZEPT.md](KONZEPT.md)
2. Prüfen Sie die in-App Hilfe-Sektion
3. Öffnen Sie ein Issue im Repository

---

## 📄 Lizenz

MIT © 2026 Marketing Powerhouse
