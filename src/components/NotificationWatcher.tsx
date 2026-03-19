/**
 * NotificationWatcher — sits inside all providers and wires up notification triggers.
 * Checks deadlines on mount & when tasks change, checks budget thresholds, etc.
 */
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useData } from '../context/DataContext';
import { useTasks } from '../context/TaskContext';

export default function NotificationWatcher() {
    const { currentUser } = useAuth();
    const { checkDeadlines, checkBudgetThresholds } = useNotifications();
    const { users, campaigns, budgetData } = useData();
    const { tasks } = useTasks();
    const deadlineChecked = useRef(false);
    const budgetChecked = useRef(false);

    // Helper: get userId by assignee name
    const getUserIdByName = (name: string): string | undefined =>
        users.find(u => u.name === name)?.id;

    // Helper: get responsible manager ID for a campaign
    const getManagerIdForCampaign = (campaignId: string): string | undefined =>
        campaigns.find(c => c.id === campaignId)?.responsibleManagerId;

    // Check deadlines once tasks & users are loaded
    useEffect(() => {
        if (!currentUser || tasks.length === 0 || users.length === 0 || deadlineChecked.current) return;
        deadlineChecked.current = true;

        checkDeadlines(
            tasks.map(t => ({
                id: t.id,
                title: t.title,
                assignee: t.assignee,
                dueDate: t.dueDate,
                publishDate: t.publishDate,
                campaignId: t.campaignId,
                status: t.status,
            })),
            getUserIdByName,
            getManagerIdForCampaign,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, tasks.length, users.length]);

    // Check budget thresholds once data is loaded
    useEffect(() => {
        if (!currentUser || budgetData.total === 0 || budgetChecked.current) return;
        budgetChecked.current = true;

        const managerAndAdminIds = users
            .filter(u => u.role === 'admin' || u.role === 'manager')
            .map(u => u.id);

        (checkBudgetThresholds as (total: number, spent: number, ids: string[]) => void)(
            budgetData.total,
            budgetData.spent,
            managerAndAdminIds,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, budgetData.total, budgetData.spent, users.length]);

    return null; // Invisible component
}
