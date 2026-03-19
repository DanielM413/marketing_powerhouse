import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

// ─── Notification Types ─────────────────────────────────────

export type NotificationType =
    | 'campaign_created' | 'campaign_updated' | 'campaign_deleted'
    | 'task_created' | 'task_updated' | 'task_status_changed' | 'task_deleted'
    | 'task_due_tomorrow' | 'task_due_today'
    | 'task_publish_tomorrow' | 'task_publish_today'
    | 'task_review_ready' | 'task_approved'
    | 'content_created' | 'content_updated' | 'content_deleted'
    | 'audience_created' | 'audience_updated' | 'audience_deleted'
    | 'touchpoint_created' | 'touchpoint_updated' | 'touchpoint_deleted'
    | 'budget_threshold_80' | 'budget_threshold_90' | 'budget_exceeded' | 'budget_expense_added'
    | 'ai_generation_complete'
    | 'positioning_updated' | 'user_role_changed';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    icon: string;
    timestamp: string;
    read: boolean;
    recipientId: string;
    actorId?: string;
    actorName?: string;
    link?: string;
    campaignId?: string;
    taskId?: string;
    priority: NotificationPriority;
}

// ─── Notification Settings ──────────────────────────────────

export interface NotificationSettings {
    campaignUpdates: boolean;
    budgetAlerts: boolean;
    taskReminders: boolean;
    teamActivities: boolean;
    weeklyReport: boolean;
    kpiAnomalies: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
    campaignUpdates: true,
    budgetAlerts: true,
    taskReminders: true,
    teamActivities: false,
    weeklyReport: true,
    kpiAnomalies: false,
};

// ─── Icon mapping ───────────────────────────────────────────

const TYPE_ICONS: Record<NotificationType, string> = {
    campaign_created: '📢', campaign_updated: '✏️', campaign_deleted: '🗑️',
    task_created: '✅', task_updated: '✏️', task_status_changed: '🔄', task_deleted: '🗑️',
    task_due_tomorrow: '⏰', task_due_today: '🚨',
    task_publish_tomorrow: '⏰', task_publish_today: '🚨',
    task_review_ready: '👀', task_approved: '✅',
    content_created: '📝', content_updated: '✏️', content_deleted: '🗑️',
    audience_created: '👥', audience_updated: '✏️', audience_deleted: '🗑️',
    touchpoint_created: '📡', touchpoint_updated: '✏️', touchpoint_deleted: '🗑️',
    budget_threshold_80: '⚠️', budget_threshold_90: '🔴', budget_exceeded: '💸', budget_expense_added: '💰',
    ai_generation_complete: '🤖',
    positioning_updated: '🎯', user_role_changed: '🛡️',
};

const PRIORITY_MAP: Record<NotificationType, NotificationPriority> = {
    campaign_created: 'medium', campaign_updated: 'low', campaign_deleted: 'medium',
    task_created: 'medium', task_updated: 'low', task_status_changed: 'low', task_deleted: 'low',
    task_due_tomorrow: 'high', task_due_today: 'urgent',
    task_publish_tomorrow: 'high', task_publish_today: 'urgent',
    task_review_ready: 'high', task_approved: 'medium',
    content_created: 'low', content_updated: 'low', content_deleted: 'low',
    audience_created: 'low', audience_updated: 'low', audience_deleted: 'low',
    touchpoint_created: 'low', touchpoint_updated: 'low', touchpoint_deleted: 'low',
    budget_threshold_80: 'medium', budget_threshold_90: 'high', budget_exceeded: 'urgent', budget_expense_added: 'low',
    ai_generation_complete: 'medium',
    positioning_updated: 'low', user_role_changed: 'high',
};

// ─── Context ────────────────────────────────────────────────

interface NotificationContextValue {
    notifications: AppNotification[];
    unreadCount: number;
    settings: NotificationSettings;
    notify: (params: {
        type: NotificationType;
        title: string;
        message: string;
        recipientIds: string[];
        actorName?: string;
        actorId?: string;
        link?: string;
        campaignId?: string;
        taskId?: string;
    }) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    updateSettings: (settings: Partial<NotificationSettings>) => void;
    checkDeadlines: (tasks: Array<{
        id: string;
        title: string;
        assignee: string;
        dueDate: string;
        publishDate?: string | null;
        campaignId: string | null;
        status: string;
    }>, getUserIdByName: (name: string) => string | undefined, getManagerIdForCampaign: (campaignId: string) => string | undefined) => void;
    checkBudgetThresholds: (total: number, spent: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STORAGE_KEY = 'momentum_notifications';
const SETTINGS_KEY = 'momentum_notification_settings';
const DEADLINE_CHECK_KEY = 'momentum_deadline_check_date';

function generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatNow(): string {
    return new Date().toISOString();
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
    const budgetAlertedRef = useRef<Set<string>>(new Set());

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setNotifications(JSON.parse(stored));
            const storedSettings = localStorage.getItem(SETTINGS_KEY);
            if (storedSettings) setSettings(JSON.parse(storedSettings));
        } catch { /* ignore corrupt data */ }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }, [settings]);

    const unreadCount = currentUser
        ? notifications.filter(n => n.recipientId === currentUser.id && !n.read).length
        : 0;

    const notify = useCallback(({ type, title, message, recipientIds, actorName, actorId, link, campaignId, taskId }: {
        type: NotificationType;
        title: string;
        message: string;
        recipientIds: string[];
        actorName?: string;
        actorId?: string;
        link?: string;
        campaignId?: string;
        taskId?: string;
    }) => {
        const newNotifications: AppNotification[] = recipientIds
            .filter(rid => rid !== actorId) // Don't notify the actor themselves
            .map(recipientId => ({
                id: generateId(),
                type,
                title,
                message,
                icon: TYPE_ICONS[type],
                timestamp: formatNow(),
                read: false,
                recipientId,
                actorId,
                actorName,
                link,
                campaignId,
                taskId,
                priority: PRIORITY_MAP[type],
            }));

        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev].slice(0, 200)); // Keep max 200
        }
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        if (!currentUser) return;
        setNotifications(prev => prev.map(n =>
            n.recipientId === currentUser.id ? { ...n, read: true } : n
        ));
    }, [currentUser]);

    const clearAll = useCallback(() => {
        if (!currentUser) return;
        setNotifications(prev => prev.filter(n => n.recipientId !== currentUser.id));
    }, [currentUser]);

    const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    // Check deadlines for tasks (called from TaskContext side-effect)
    const checkDeadlines = useCallback((
        tasks: Array<{
            id: string; title: string; assignee: string;
            dueDate: string; publishDate?: string | null;
            campaignId: string | null; status: string;
        }>,
        getUserIdByName: (name: string) => string | undefined,
        getManagerIdForCampaign: (campaignId: string) => string | undefined,
    ) => {
        if (!settings.taskReminders) return;

        const todayStr = new Date().toISOString().split('T')[0];
        const lastCheck = localStorage.getItem(DEADLINE_CHECK_KEY);
        if (lastCheck === todayStr) return; // Already checked today
        localStorage.setItem(DEADLINE_CHECK_KEY, todayStr);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const completedStatuses = ['analyzed', 'live', 'monitoring'];

        for (const task of tasks) {
            if (completedStatuses.includes(task.status)) continue;

            const assigneeId = getUserIdByName(task.assignee);
            const managerId = task.campaignId ? getManagerIdForCampaign(task.campaignId) : undefined;
            const recipientIds = [assigneeId, managerId].filter((id): id is string => !!id);

            if (recipientIds.length === 0) continue;

            // Due date checks
            if (task.dueDate === todayStr) {
                notify({
                    type: 'task_due_today',
                    title: 'Aufgabe heute fällig!',
                    message: `"${task.title}" ist heute fällig.`,
                    recipientIds,
                    actorName: 'System',
                    link: '/tasks',
                    taskId: task.id,
                    campaignId: task.campaignId || undefined,
                });
            } else if (task.dueDate === tomorrowStr) {
                notify({
                    type: 'task_due_tomorrow',
                    title: 'Aufgabe morgen fällig',
                    message: `"${task.title}" ist morgen fällig.`,
                    recipientIds,
                    actorName: 'System',
                    link: '/tasks',
                    taskId: task.id,
                    campaignId: task.campaignId || undefined,
                });
            }

            // Publish date checks
            if (task.publishDate) {
                if (task.publishDate === todayStr) {
                    notify({
                        type: 'task_publish_today',
                        title: 'Veröffentlichung heute!',
                        message: `"${task.title}" soll heute veröffentlicht werden.`,
                        recipientIds,
                        actorName: 'System',
                        link: '/tasks',
                        taskId: task.id,
                        campaignId: task.campaignId || undefined,
                    });
                } else if (task.publishDate === tomorrowStr) {
                    notify({
                        type: 'task_publish_tomorrow',
                        title: 'Veröffentlichung morgen',
                        message: `"${task.title}" wird morgen veröffentlicht.`,
                        recipientIds,
                        actorName: 'System',
                        link: '/tasks',
                        taskId: task.id,
                        campaignId: task.campaignId || undefined,
                    });
                }
            }
        }
    }, [notify, settings.taskReminders]);

    // Check budget thresholds
    const checkBudgetThresholds = useCallback((total: number, spent: number) => {
        if (!settings.budgetAlerts || total === 0) return;

        const percent = (spent / total) * 100;
        let type: NotificationType | null = null;
        let title = '';
        let message = '';

        if (percent > 100 && !budgetAlertedRef.current.has('exceeded')) {
            type = 'budget_exceeded';
            title = 'Budget überschritten!';
            message = `Das Gesamtbudget wurde überschritten (${percent.toFixed(0)}%). Sofortige Überprüfung erforderlich.`;
            budgetAlertedRef.current.add('exceeded');
        } else if (percent >= 90 && !budgetAlertedRef.current.has('90')) {
            type = 'budget_threshold_90';
            title = 'Budget kritisch: 90% ausgelastet';
            message = `${percent.toFixed(0)}% des Gesamtbudgets (${spent.toLocaleString('de-DE')}€ von ${total.toLocaleString('de-DE')}€) sind ausgegeben.`;
            budgetAlertedRef.current.add('90');
        } else if (percent >= 80 && !budgetAlertedRef.current.has('80')) {
            type = 'budget_threshold_80';
            title = 'Budget-Warnung: 80% erreicht';
            message = `${percent.toFixed(0)}% des Gesamtbudgets (${spent.toLocaleString('de-DE')}€ von ${total.toLocaleString('de-DE')}€) sind ausgegeben.`;
            budgetAlertedRef.current.add('80');
        }

        if (type) {
            // Notify all admins and managers — recipientIds set to placeholder,
            // actual users resolved by the caller
            notify({
                type,
                title,
                message,
                recipientIds: [], // Will be filled by the caller
                actorName: 'System',
                link: '/budget',
            });
        }
    }, [notify, settings.budgetAlerts]);

    // Override checkBudgetThresholds to accept recipientIds
    const checkBudgetThresholdsWithRecipients = useCallback((total: number, spent: number, managerAndAdminIds?: string[]) => {
        if (!settings.budgetAlerts || total === 0) return;

        const percent = (spent / total) * 100;
        let type: NotificationType | null = null;
        let title = '';
        let message = '';

        if (percent > 100 && !budgetAlertedRef.current.has('exceeded')) {
            type = 'budget_exceeded';
            title = 'Budget überschritten!';
            message = `Das Gesamtbudget wurde überschritten (${percent.toFixed(0)}%). Sofortige Überprüfung erforderlich.`;
            budgetAlertedRef.current.add('exceeded');
        } else if (percent >= 90 && !budgetAlertedRef.current.has('90')) {
            type = 'budget_threshold_90';
            title = 'Budget kritisch: 90% ausgelastet';
            message = `${percent.toFixed(0)}% des Gesamtbudgets (${spent.toLocaleString('de-DE')}€ von ${total.toLocaleString('de-DE')}€) sind ausgegeben.`;
            budgetAlertedRef.current.add('90');
        } else if (percent >= 80 && !budgetAlertedRef.current.has('80')) {
            type = 'budget_threshold_80';
            title = 'Budget-Warnung: 80% erreicht';
            message = `${percent.toFixed(0)}% des Gesamtbudgets (${spent.toLocaleString('de-DE')}€ von ${total.toLocaleString('de-DE')}€) sind ausgegeben.`;
            budgetAlertedRef.current.add('80');
        }

        if (type && managerAndAdminIds && managerAndAdminIds.length > 0) {
            notify({
                type,
                title,
                message,
                recipientIds: managerAndAdminIds,
                actorName: 'System',
                link: '/budget',
            });
        }
    }, [notify, settings.budgetAlerts]);

    return (
        <NotificationContext.Provider value={{
            notifications, unreadCount, settings,
            notify, markAsRead, markAllAsRead, clearAll,
            updateSettings,
            checkDeadlines,
            checkBudgetThresholds: checkBudgetThresholdsWithRecipients as unknown as NotificationContextValue['checkBudgetThresholds'],
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications(): NotificationContextValue {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
}
