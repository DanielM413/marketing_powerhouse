# 🚀 Momentum

Eine **SaaS-Plattform zur Unterstützung und Automatisierung von Marketingprozessen**. Momentum vereint Kampagnen-Management, Content-Planung, Budget-Kontrolle und Team-Zusammenarbeit in einer DSGVO-konformen, europäischen Lösung.

> **Tagline:** Deine Marketing-Kampagnen mit Momentum

![Version](https://img.shields.io/badge/version-0.8.1-blue)
![Status](https://img.shields.io/badge/status-Phase%201-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Features

✅ **Kampagnen-Management** — Multi-Channel Kampagnen verwalten mit Master-Prompts, Zielgruppen und Keywords-System  
✅ **Customer Journey Mapping** — 5-Phasen-Modell + ASIDAS-Funnel mit Content-Verknüpfung und Deep-Linking  
✅ **Kanäle & Touchpoints** — Single-Source-of-Truth für alle Marketing-Kanäle mit bidirektionaler Analyse und Kanal-KPIs  
✅ **Content-Kalender** — Visuelle Planung mit 6-stufigem Status-Workflow und Warnsystem  
✅ **Zielgruppen-Management** — Persona-Avatare, Segment-Filter, Journey-Integration  
✅ **Aufgaben & Creatives** — Einheitlicher 10-stufiger Creative-Workflow mit KI-Assistent  
✅ **Budget & Controlling** — Rollenbasierte Budget-Einsicht mit KPI-Tracking und CSV-Export  
✅ **Benachrichtigungssystem** — Rollenbasierte Echtzeit-Benachrichtigungen mit Deadline-Warnungen, Budget-Alerts und Kampagnen-Updates  
✅ **Rollenbasierte Access Control (RBAC)** — Admin, Manager, Member mit 18 spezifischen Berechtigungen  
✅ **Digitale Positionierung** — Unternehmens-DNA, Vision, Mission, Tone of Voice, Keywords  
✅ **KI-Assistent** — Automatische Content-Generierung und -Analyse für Aufgaben  
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

Server läuft unter: **http://localhost:3000**

---

## 👥 Test-Accounts

Zum Testen verschiedener Rollen verwenden Sie diese Accounts:

| Rolle | Name | E-Mail | Passwort | Abteilung |
|---|---|---|---|---|
| 🔴 Admin | Daniel Moretz | `daniel@test-it-academy.de` | `admin123` | Geschäftsführung & Training |
| 🟣 Manager | Waleri Moretz | `waleri@test-it-academy.de` | `manager123` | Training & Qualität |
| 🟣 Manager | Anna Schmidt | `anna@test-it-academy.de` | `manager123` | Marketing |
| 🟢 Member | Lisa Bauer | `lisa@test-it-academy.de` | `member123` | Marketing (Content) |
| 🟢 Member | Tom Weber | `tom@test-it-academy.de` | `member123` | Performance Marketing |
| 🟢 Member | Jana Klein | `jana@test-it-academy.de` | `member123` | Kundenservice |

**Hinweis:** Ein Dev-Panel auf der Login-Seite erlaubt Schnellzugang zu allen Test-Accounts.

---

## 📁 Projektstruktur

```
Marketing_powerhouse/
├── next.config.ts                    ← Next.js Konfiguration
├── postcss.config.mjs                ← PostCSS mit Tailwind CSS v4
├── tsconfig.json                     ← TypeScript-Konfiguration
├── vitest.config.ts                  ← Test-Konfiguration
├── package.json
├── .env.local                        ← Supabase-Credentials (nicht im Git)
├── KONZEPT.md                        ← Ausführliche technische Dokumentation
├── NOTIFICATION_KONZEPT.md           ← Benachrichtigungssystem-Konzept
├── scripts/
│   └── migrate.mjs                   ← DB-Schema + Seed-Daten Migrationsskript
├── app/                              ← Next.js App Router (Seiten-Routing)
│   ├── layout.tsx                    ← Root-Layout (HTML, Fonts, Providers)
│   ├── providers.tsx                 ← Client-seitiger Context-Provider-Wrapper
│   ├── client-shell.tsx              ← Auth-Gate + Layout (Sidebar/Header)
│   ├── page.tsx                      ← Dashboard (/)
│   ├── campaigns/
│   │   ├── page.tsx                  ← Kampagnen-Liste (/campaigns)
│   │   └── [id]/page.tsx             ← Kampagnen-Detail (/campaigns/:id)
│   ├── audiences/page.tsx            ← Zielgruppen (/audiences)
│   ├── journeys/page.tsx             ← Customer Journey (/journeys)
│   ├── asidas/page.tsx               ← ASIDAS Funnel (/asidas)
│   ├── touchpoints/page.tsx          ← Kanäle & Touchpoints (/touchpoints)
│   ├── content/page.tsx              ← Content-Kalender (/content)
│   ├── content-overview/page.tsx     ← Content-Übersicht (/content-overview)
│   ├── budget/page.tsx               ← Budget (/budget)
│   ├── tasks/page.tsx                ← Aufgaben (/tasks)
│   ├── positioning/page.tsx          ← Digitale Positionierung (/positioning)
│   ├── settings/page.tsx             ← Einstellungen (/settings)
│   └── manual/page.tsx               ← Handbuch (/manual)
└── src/
    ├── index.css                     ← Tailwind CSS v4 + Design System
    ├── lib/
    │   ├── supabase.ts               ← Supabase-Client (Singleton)
    │   ├── api.ts                    ← Vollständige CRUD-API
    │   └── constants.ts              ← Content-Type-Farben
    ├── types/
    │   ├── index.ts                  ← Zentrale TypeScript-Typdefinitionen
    │   └── dashboard.ts              ← Dashboard-spezifische Typen
    ├── context/
    │   ├── AuthContext.tsx            ← RBAC: Rollen, Permissions, Login
    │   ├── DataContext.tsx            ← Zentraler Daten-Provider (CRUD)
    │   ├── ContentContext.tsx         ← Content-State-Management
    │   ├── TaskContext.tsx            ← Aufgaben-State-Management
    │   └── NotificationContext.tsx    ← Benachrichtigungssystem
    ├── hooks/
    │   └── useNotifyActions.ts       ← Wrapper-Hook für CRUD mit Notifications
    ├── components/
    │   ├── Layout.tsx                ← App-Shell (Sidebar + Header + Content)
    │   ├── Sidebar.tsx               ← Navigation
    │   ├── Header.tsx                ← Breadcrumb + Benachrichtigungs-Glocke
    │   ├── NotificationBell.tsx      ← Benachrichtigungs-Dropdown
    │   ├── NotificationWatcher.tsx   ← Automatische Deadline- & Budget-Prüfung
    │   ├── PageHelp.tsx              ← Kontextuelle Hilfe-Komponente
    │   ├── ...                       ← Weitere UI-Komponenten
    │   └── ui/                       ← Basis-UI-Komponenten
    ├── views/                        ← Seiten-Komponenten
    │   ├── DashboardPage.tsx
    │   ├── CampaignsPage.tsx
    │   ├── CampaignDetailPage.tsx
    │   ├── AudiencesPage.tsx
    │   ├── ContentCalendarPage.tsx
    │   ├── BudgetPage.tsx
    │   ├── TasksPage.tsx
    │   ├── PositioningPage.tsx
    │   ├── ManualPage.tsx
    │   ├── SettingsPage.tsx
    │   └── ...
    └── data/                         ← Mock-Daten (Legacy/Fallback)
```

---

## 🔐 Rollenmodell

### Rollen & Berechtigungen

| Berechtigung | Admin | Manager | Member |
|---|:---:|:---:|:---:|
| **Positionierung bearbeiten** | ✅ | ❌ | ❌ |
| **Unternehmensweite Keywords** | ✅ | ❌ | ❌ |
| **User-Management** | ✅ | ❌ | ❌ |
| **Einstellungen bearbeiten** | ✅ | ❌ | ❌ |
| **Kampagnen erstellen/bearbeiten** | ✅ | ✅ | ❌ |
| **Zielgruppen bearbeiten** | ✅ | ✅ | ❌ |
| **Budget einsehen/bearbeiten** | ✅ | ✅ | ❌ |
| **Aufgaben zuweisen** | ✅ | ✅ | ❌ |
| **Touchpoints verwalten** | ✅ | ✅ | ❌ |
| **Content bearbeiten** | ✅ | ✅ | ❌ |
| **Elemente löschen** | ✅ | ✅ | ❌ |
| **Eigene Aufgaben bearbeiten** | ✅ | ✅ | ✅ |
| **Zielgruppen einsehen** | ✅ | ✅ | ✅ |

Detaillierte Berechtigungs-Matrix in [KONZEPT.md](KONZEPT.md#4--rollen--berechtigungen-rbac)

---

## 🔔 Benachrichtigungssystem

Das integrierte Benachrichtigungssystem informiert Benutzer rollenbasiert über relevante Ereignisse:

### Benachrichtigungs-Typen

| Kategorie | Beispiele | Empfänger |
|---|---|---|
| **Kampagnen** | Erstellt, aktualisiert, gelöscht | Team-Members + Manager der Kampagne |
| **Aufgaben** | Erstellt, zugewiesen, Status geändert, freigegeben | Assignee + Kampagnen-Manager |
| **Deadlines** | Aufgabe morgen fällig, Veröffentlichung heute | Assignee + Kampagnen-Manager |
| **Budget** | 80%, 90%, 100% Auslastung | Alle Admins + Manager |
| **Content** | Erstellt, aktualisiert, gelöscht | Team-Members der Kampagne |
| **Zielgruppen** | Erstellt, aktualisiert, gelöscht | Alle Manager + Admins |
| **Touchpoints** | Erstellt, aktualisiert, gelöscht | Alle Manager + Admins |
| **KI-Agent** | Generierung abgeschlossen | Task-Assignee |
| **Positionierung** | Aktualisiert | Alle Manager |

### Prioritäten

- 🔴 **Dringend** — Budget überschritten, Aufgabe heute fällig
- 🟡 **Hoch** — Budget ≥ 90%, Veröffentlichung morgen, Aufgabe in Review
- 🟣 **Mittel** — Kampagne erstellt, Aufgabe zugewiesen, Budget ≥ 80%
- ⚪ **Niedrig** — Statusänderungen, Content-Updates

### Konfiguration

Unter **Einstellungen → Benachrichtigungen** können folgende Kategorien individuell ein-/ausgeschaltet werden:
- Kampagnen-Updates
- Budget-Alerts
- Aufgaben-Erinnerungen
- Team-Aktivitäten
- Wöchentlicher Report
- KPI-Anomalien

---

## 📚 Navigation Struktur

Die Sidebar ist in folgende Bereiche unterteilt:

**Übersicht**
- Dashboard

**Marketing**
- Kampagnen
- Zielgruppen
- Customer Journey
- ASIDAS Funnel
- Kanäle & Touchpoints
- Content-Übersicht
- Content-Kalender
- Budget & Controlling

**Team**
- Aufgaben

**Unternehmen**
- Digitale Positionierung

**System**
- Anleitung
- Einstellungen

---

## 🔧 Technologie-Stack

| Schicht | Technologie | Status |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) | ✅ Aktiv |
| **Sprache** | TypeScript (strict mode) | ✅ Aktiv |
| **Frontend** | React 19 | ✅ Aktiv |
| **Styling** | Tailwind CSS v4 + Design System (CSS Custom Properties) | ✅ Aktiv |
| **Routing** | Next.js App Router (dateibasiert) | ✅ Aktiv |
| **State** | React Context (Auth, Data, Task, Content, Notification) | ✅ Aktiv |
| **Charts** | Recharts | ✅ Aktiv |
| **Icons** | Lucide React | ✅ Aktiv |
| **Build-Tool** | Turbopack (integriert in Next.js) | ✅ Aktiv |
| **Linting** | ESLint + @typescript-eslint | ✅ Aktiv |
| **Testing** | Vitest | ✅ Aktiv |
| **Backend / DB** | Supabase (PostgreSQL, eu-central-1) | ✅ Aktiv |

---

## 📝 Verfügbare Scripts

```bash
# Development Server (Turbopack)
npm run dev

# Production Build
npm run build

# Preview Build
npm start

# Linting
npm run lint

# Tests
npm test
```

---

## 🎨 Design-System

Momentum verwendet ein umfassendes CSS-basiertes Design-System:

- **Dark Theme** mit branding-konformen Farben
- **CSS Custom Properties** für zentrale Verwaltung (Farben, Spacing, Typografie)
- **Komponenten-Klassen** für Buttons, Cards, Stats, Modals, Kanban, etc.
- **Responsive** (Desktop optimiert)
- **Animationen** (fadeIn, slideUp, slideInRight)

---

## 🗂️ Datenmodell

Das System verwendet Supabase (PostgreSQL) als Backend mit folgendem Datenmodell:

- **Users** — Benutzer mit Rollen (admin, manager, member)
- **Campaigns** — Marketing-Kampagnen mit Team-Zuordnung und Multi-Channel-Support
- **Audiences/Personas** — Zielgruppen mit Segmentierung (B2B/B2C)
- **Content** — Redaktionell geplanter Content mit 6-stufigem Status
- **Tasks/Creatives** — Aufgaben mit 10-stufigem Workflow und KI-Integration
- **Budget** — Budget-Tracking und KPI-Management
- **Touchpoints** — Marketing-Kanäle (Paid, Owned, Earned, Direct) mit KPIs
- **Journeys** — Customer Journey (5-Phasen) und ASIDAS-Funnel
- **Company Positioning** — Unternehmens-DNA, Vision, Mission, Keywords
- **Notifications** — Rollenbasierte Benachrichtigungen (Client-side, localStorage)

Detailliertes Datenmodell siehe [KONZEPT.md § 7](KONZEPT.md#7-datenmodell-supabase-postgresql)

---

## 📖 Dokumentation

- **[KONZEPT.md](KONZEPT.md)** — Ausführliche technische Dokumentation, Features, Datenmodell
- **[NOTIFICATION_KONZEPT.md](NOTIFICATION_KONZEPT.md)** — Benachrichtigungssystem-Konzept und Empfänger-Matrix
- **[WORKFLOWS.md](WORKFLOWS.md)** — Detaillierte Workflow-Beispiele mit konkreten Szenarien
- **In-App Handbuch** — Rollenspezifische Anleitung unter `/manual`
- **Kontextuelle Hilfe** — PageHelp-Komponente auf jeder Hauptseite
- **Dev-Login Panel** — Schneller Zugang zu Test-Accounts

---

## 🤝 Support

Für Fragen oder Probleme:
1. Konsultieren Sie [KONZEPT.md](KONZEPT.md)
2. Prüfen Sie die in-App Hilfe-Sektion unter `/manual`
3. Öffnen Sie ein Issue im Repository

---

## 📄 Lizenz

MIT © 2026 Marketing Powerhouse
