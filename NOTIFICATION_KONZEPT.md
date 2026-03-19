# Benachrichtigungssystem – Konzept

## 1. Übersicht

Das Benachrichtigungssystem informiert Benutzer über relevante Ereignisse im System, basierend auf ihrer Rolle und Zuordnung zu Kampagnen/Aufgaben.

---

## 2. Notification-Typen

| Typ | Beschreibung | Icon |
|-----|-------------|------|
| `campaign_created` | Neue Kampagne erstellt | 📢 |
| `campaign_updated` | Kampagne bearbeitet (Status, Budget, Team) | ✏️ |
| `campaign_deleted` | Kampagne gelöscht | 🗑️ |
| `task_created` | Neue Aufgabe erstellt | ✅ |
| `task_updated` | Aufgabe bearbeitet (Status, Assignee, etc.) | ✏️ |
| `task_status_changed` | Aufgabenstatus geändert (Kanban-Drag) | 🔄 |
| `task_deleted` | Aufgabe gelöscht | 🗑️ |
| `task_due_tomorrow` | Aufgabe ist morgen fällig | ⏰ |
| `task_due_today` | Aufgabe ist heute fällig | 🚨 |
| `task_publish_tomorrow` | Veröffentlichung morgen | ⏰ |
| `task_publish_today` | Veröffentlichung heute | 🚨 |
| `content_created` | Neuer Content geplant | 📝 |
| `content_updated` | Content aktualisiert | ✏️ |
| `content_deleted` | Content gelöscht | 🗑️ |
| `audience_created` | Neue Zielgruppe erstellt | 👥 |
| `audience_updated` | Zielgruppe aktualisiert | ✏️ |
| `audience_deleted` | Zielgruppe gelöscht | 🗑️ |
| `touchpoint_created` | Neuer Touchpoint erstellt | 📡 |
| `touchpoint_updated` | Touchpoint aktualisiert | ✏️ |
| `touchpoint_deleted` | Touchpoint gelöscht | 🗑️ |
| `budget_threshold_80` | Budgetauslastung >= 80% | ⚠️ |
| `budget_threshold_90` | Budgetauslastung >= 90% | 🔴 |
| `budget_exceeded` | Budget überschritten (>100%) | 💸 |
| `budget_expense_added` | Neue Ausgabe erfasst | 💰 |
| `ai_generation_complete` | KI-Generierung abgeschlossen | 🤖 |
| `task_review_ready` | Aufgabe bereit zur Freigabe (→ Review) | 👀 |
| `task_approved` | Aufgabe freigegeben | ✅ |

---

## 3. Rollenbasierte Empfänger-Matrix

### 3.1 Member-Aktionen → Manager-Benachrichtigungen

| Member-Aktion | Benachrichtigung an | Beschreibung |
|---------------|---------------------|-------------|
| Aufgabenstatus geändert | Kampagnen-Manager | Member verschiebt Task im Kanban |
| Aufgabe in "Review" | Kampagnen-Manager | Content bereit zur Freigabe |
| AI-Feedback gesendet | Kampagnen-Manager | Member gibt KI-Feedback |
| AI-Generierung abgeschlossen | Aufgaben-Assignee | KI-Entwurf fertig |

### 3.2 Manager-Aktionen → Member-Benachrichtigungen

| Manager-Aktion | Benachrichtigung an | Beschreibung |
|----------------|---------------------|-------------|
| Aufgabe zugewiesen | Zugewiesenes Member | Neue Aufgabe für Member |
| Aufgabe freigegeben | Aufgaben-Assignee | Approved vom Manager |
| Content erstellt | Team-Members der Kampagne | Neuer Content im Kalender |
| Kampagne erstellt/aktualisiert | Alle Team-Members | Neue/geänderte Kampagne |

### 3.3 System-Benachrichtigungen

| Trigger | Empfänger | Beschreibung |
|---------|-----------|-------------|
| Aufgabe fällig morgen | Assignee + Kampagnen-Manager | 24h Deadline-Warnung |
| Aufgabe fällig heute | Assignee + Kampagnen-Manager | Heute fällig! |
| Veröffentlichung morgen | Assignee + Kampagnen-Manager | Publish-Deadline morgen |
| Veröffentlichung heute | Assignee + Kampagnen-Manager | Heute veröffentlichen! |
| Budget >= 80% | Alle Manager + Admin | Budget-Warnung |
| Budget >= 90% | Alle Manager + Admin | Budget kritisch |
| Budget > 100% | Alle Manager + Admin | Budget überschritten |

### 3.4 Admin-spezifische Benachrichtigungen

| Trigger | Empfänger |
|---------|-----------|
| Positionierung aktualisiert | Alle Manager |
| Touchpoint erstellt/gelöscht | Alle Manager |
| Benutzerrolle geändert | Betroffener Benutzer |

---

## 4. Technische Architektur

### 4.1 NotificationContext
- Neuer React Context `NotificationContext` 
- Speichert Notifications in State inkl. gelesen/ungelesen Status
- Prüft beim Laden auf Deadline-Benachrichtigungen
- Stellt `notify()` Funktion bereit, die von allen anderen Contexts aufgerufen wird

### 4.2 Notification-Datenmodell
```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
  userId: string;         // Empfänger
  actorId?: string;       // Auslöser
  actorName?: string;     // Name des Auslösers
  link?: string;          // Deep-Link zur betroffenen Seite
  campaignId?: string;    // Verknüpfte Kampagne
  taskId?: string;        // Verknüpfte Aufgabe
  priority: 'low' | 'medium' | 'high' | 'urgent';
}
```

### 4.3 UI-Komponenten
- **NotificationBell** (Header): Badge mit Anzahl ungelesener, Dropdown-Panel
- **NotificationPanel**: Ausklappbare Liste aller Benachrichtigungen
- **NotificationItem**: Einzelne Benachrichtigung mit Icon, Text, Zeitstempel
- **Settings-Integration**: Toggle-Schalter in Einstellungen bleiben bestehen

---

## 5. Prioritäten

| Priorität | Bedingung |
|-----------|-----------|
| `urgent` | Budget überschritten, Aufgabe heute fällig |
| `high` | Budget >= 90%, Veröffentlichung morgen, Task in Review |
| `medium` | Kampagne erstellt, Aufgabe zugewiesen, Budget >= 80% |
| `low` | Statusänderungen, Content-Updates, allgemeine Aktivitäten |
