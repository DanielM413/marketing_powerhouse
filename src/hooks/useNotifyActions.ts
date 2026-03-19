/**
 * useNotifyActions — provides wrapped CRUD actions that trigger notifications.
 * Import and use this instead of raw context methods when you want notifications.
 */
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useData } from '../context/DataContext';
import { useTasks } from '../context/TaskContext';
import { useContents } from '../context/ContentContext';
import type { Campaign, Task, TaskStatus, ContentItem, Audience, Touchpoint } from '../types';

export function useNotifyActions() {
    const { currentUser } = useAuth();
    const { notify } = useNotifications();
    const {
        users, campaigns,
        addCampaign, updateCampaign, deleteCampaign,
        addAudience, updateAudience, deleteAudience,
        addTouchpoint, updateTouchpoint, deleteTouchpoint,
        savePositioning,
    } = useData();
    const { addTask, updateTask, deleteTask, updateTaskStatus, executeAiAgent, sendAiFeedback, analyzeTask } = useTasks();
    const { addContent, updateContent, deleteContent } = useContents();

    // Helper: get all admin & manager user IDs
    const getManagerAdminIds = useCallback(() =>
        users.filter(u => u.role === 'admin' || u.role === 'manager').map(u => u.id),
        [users]
    );

    // Helper: get team member IDs + manager for a campaign
    const getCampaignRecipients = useCallback((campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return [];
        const ids = [...(campaign.teamMemberIds || [])];
        if (campaign.responsibleManagerId) ids.push(campaign.responsibleManagerId);
        return [...new Set(ids)];
    }, [campaigns]);

    // Helper: get the responsible manager for a campaign
    const getManagerForCampaign = useCallback((campaignId: string | null) => {
        if (!campaignId) return undefined;
        return campaigns.find(c => c.id === campaignId)?.responsibleManagerId;
    }, [campaigns]);

    // Helper: get user ID by name
    const getUserIdByName = useCallback((name: string) =>
        users.find(u => u.name === name)?.id,
        [users]
    );

    // ── Campaign Actions ──────────────────────────────

    const notifyAddCampaign = useCallback(async (campaign: Omit<Campaign, 'id'>) => {
        const created = await addCampaign(campaign);
        const recipientIds = [
            ...(campaign.teamMemberIds || []),
            campaign.responsibleManagerId,
        ].filter((id): id is string => !!id);

        notify({
            type: 'campaign_created',
            title: 'Neue Kampagne erstellt',
            message: `"${campaign.name}" wurde erstellt.`,
            recipientIds,
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: `/campaigns/${created.id}`,
            campaignId: created.id,
        });
        return created;
    }, [addCampaign, notify, currentUser]);

    const notifyUpdateCampaign = useCallback(async (id: string, updates: Partial<Campaign>) => {
        await updateCampaign(id, updates);
        const recipientIds = getCampaignRecipients(id);

        notify({
            type: 'campaign_updated',
            title: 'Kampagne aktualisiert',
            message: `Kampagne wurde bearbeitet.`,
            recipientIds,
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: `/campaigns/${id}`,
            campaignId: id,
        });
    }, [updateCampaign, notify, currentUser, getCampaignRecipients]);

    const notifyDeleteCampaign = useCallback(async (id: string) => {
        const campaign = campaigns.find(c => c.id === id);
        const recipientIds = getCampaignRecipients(id);
        await deleteCampaign(id);

        notify({
            type: 'campaign_deleted',
            title: 'Kampagne gelöscht',
            message: `"${campaign?.name || 'Kampagne'}" wurde gelöscht.`,
            recipientIds,
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/campaigns',
        });
    }, [deleteCampaign, notify, currentUser, campaigns, getCampaignRecipients]);

    // ── Task Actions ──────────────────────────────────

    const notifyAddTask = useCallback(async (task: Omit<Task, 'id'> & { id?: string }) => {
        await addTask(task);
        const recipientIds: string[] = [];
        const assigneeId = getUserIdByName(task.assignee);
        if (assigneeId) recipientIds.push(assigneeId);
        const managerId = getManagerForCampaign(task.campaignId);
        if (managerId) recipientIds.push(managerId);

        notify({
            type: 'task_created',
            title: 'Neue Aufgabe erstellt',
            message: `"${task.title}" wurde erstellt und ${task.assignee} zugewiesen.`,
            recipientIds,
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/tasks',
            campaignId: task.campaignId || undefined,
        });
    }, [addTask, notify, currentUser, getUserIdByName, getManagerForCampaign]);

    const notifyUpdateTask = useCallback(async (id: string, updates: Partial<Task>, currentTask?: Task) => {
        await updateTask(id, updates);
        const recipientIds: string[] = [];
        // Notify assignee if reassigned
        if (updates.assignee && updates.assignee !== currentTask?.assignee) {
            const newAssigneeId = getUserIdByName(updates.assignee);
            if (newAssigneeId) recipientIds.push(newAssigneeId);
        }
        // Notify old assignee too
        if (currentTask?.assignee) {
            const oldAssigneeId = getUserIdByName(currentTask.assignee);
            if (oldAssigneeId) recipientIds.push(oldAssigneeId);
        }
        // Notify campaign manager
        const cId = updates.campaignId ?? currentTask?.campaignId;
        const managerId = getManagerForCampaign(cId ?? null);
        if (managerId) recipientIds.push(managerId);

        if (recipientIds.length > 0) {
            notify({
                type: 'task_updated',
                title: 'Aufgabe aktualisiert',
                message: `"${currentTask?.title || 'Aufgabe'}" wurde bearbeitet.`,
                recipientIds: [...new Set(recipientIds)],
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/tasks',
                campaignId: cId || undefined,
            });
        }
    }, [updateTask, notify, currentUser, getUserIdByName, getManagerForCampaign]);

    const notifyUpdateTaskStatus = useCallback(async (id: string, newStatus: TaskStatus, task?: Task) => {
        await updateTaskStatus(id, newStatus);
        const recipientIds: string[] = [];
        if (task?.assignee) {
            const assigneeId = getUserIdByName(task.assignee);
            if (assigneeId) recipientIds.push(assigneeId);
        }
        const managerId = getManagerForCampaign(task?.campaignId ?? null);
        if (managerId) recipientIds.push(managerId);

        // Specific notification types for key transitions
        let type: 'task_status_changed' | 'task_review_ready' | 'task_approved' = 'task_status_changed';
        let title = 'Aufgabenstatus geändert';
        let message = `"${task?.title || 'Aufgabe'}" → ${newStatus}`;

        if (newStatus === 'review') {
            type = 'task_review_ready';
            title = 'Aufgabe bereit zur Freigabe';
            message = `"${task?.title}" wurde zur Freigabe eingereicht.`;
        } else if (newStatus === 'approved') {
            type = 'task_approved';
            title = 'Aufgabe freigegeben';
            message = `"${task?.title}" wurde freigegeben.`;
        }

        if (recipientIds.length > 0) {
            notify({
                type,
                title,
                message,
                recipientIds: [...new Set(recipientIds)],
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/tasks',
                taskId: id,
                campaignId: task?.campaignId || undefined,
            });
        }
    }, [updateTaskStatus, notify, currentUser, getUserIdByName, getManagerForCampaign]);

    const notifyDeleteTask = useCallback(async (id: string, task?: Task) => {
        await deleteTask(id);
        const recipientIds: string[] = [];
        if (task?.assignee) {
            const assigneeId = getUserIdByName(task.assignee);
            if (assigneeId) recipientIds.push(assigneeId);
        }
        const managerId = getManagerForCampaign(task?.campaignId ?? null);
        if (managerId) recipientIds.push(managerId);

        if (recipientIds.length > 0) {
            notify({
                type: 'task_deleted',
                title: 'Aufgabe gelöscht',
                message: `"${task?.title || 'Aufgabe'}" wurde gelöscht.`,
                recipientIds: [...new Set(recipientIds)],
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/tasks',
            });
        }
    }, [deleteTask, notify, currentUser, getUserIdByName, getManagerForCampaign]);

    const notifyExecuteAiAgent = useCallback((id: string, prompt: string, taskType: string, task?: Task) => {
        executeAiAgent(id, prompt, taskType);
        // AI completion notification is triggered after timeout - we'll notify assignee
        if (task?.assignee) {
            const assigneeId = getUserIdByName(task.assignee);
            if (assigneeId) {
                setTimeout(() => {
                    notify({
                        type: 'ai_generation_complete',
                        title: 'KI-Generierung abgeschlossen',
                        message: `KI-Entwurf für "${task.title}" ist bereit.`,
                        recipientIds: [assigneeId],
                        actorName: 'KI-Agent',
                        link: '/tasks',
                        taskId: id,
                    });
                }, 2200);
            }
        }
    }, [executeAiAgent, notify, getUserIdByName]);

    const notifySendAiFeedback = useCallback((id: string, feedback: string, task?: Task) => {
        sendAiFeedback(id, feedback);
        // Notify campaign manager
        const managerId = getManagerForCampaign(task?.campaignId ?? null);
        if (managerId) {
            notify({
                type: 'task_status_changed',
                title: 'KI-Feedback gesendet',
                message: `${currentUser?.name} hat Feedback zur KI-Generierung von "${task?.title}" gesendet.`,
                recipientIds: [managerId],
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/tasks',
                taskId: id,
            });
        }
    }, [sendAiFeedback, notify, currentUser, getManagerForCampaign]);

    const notifyAnalyzeTask = useCallback((id: string, task?: Task) => {
        analyzeTask(id);
        const managerId = getManagerForCampaign(task?.campaignId ?? null);
        if (managerId) {
            notify({
                type: 'task_status_changed',
                title: 'Aufgabe analysiert',
                message: `"${task?.title}" wurde analysiert.`,
                recipientIds: [managerId],
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/tasks',
                taskId: id,
            });
        }
    }, [analyzeTask, notify, currentUser, getManagerForCampaign]);

    // ── Content Actions ───────────────────────────────

    const notifyAddContent = useCallback(async (content: Omit<ContentItem, 'id' | 'createdAt'>) => {
        const id = await addContent(content);
        if (content.campaignId) {
            const recipientIds = getCampaignRecipients(content.campaignId);
            notify({
                type: 'content_created',
                title: 'Neuer Content geplant',
                message: `"${content.title}" wurde im Content-Kalender erstellt.`,
                recipientIds,
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/content',
                campaignId: content.campaignId,
            });
        }
        return id;
    }, [addContent, notify, currentUser, getCampaignRecipients]);

    const notifyUpdateContent = useCallback(async (id: string, updates: Partial<ContentItem>, currentContent?: ContentItem) => {
        await updateContent(id, updates);
        const cId = updates.campaignId ?? currentContent?.campaignId;
        if (cId) {
            const recipientIds = getCampaignRecipients(cId);
            notify({
                type: 'content_updated',
                title: 'Content aktualisiert',
                message: `"${currentContent?.title || 'Content'}" wurde bearbeitet.`,
                recipientIds,
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/content',
                campaignId: cId,
            });
        }
    }, [updateContent, notify, currentUser, getCampaignRecipients]);

    const notifyDeleteContent = useCallback(async (id: string, currentContent?: ContentItem) => {
        await deleteContent(id);
        if (currentContent?.campaignId) {
            const recipientIds = getCampaignRecipients(currentContent.campaignId);
            notify({
                type: 'content_deleted',
                title: 'Content gelöscht',
                message: `"${currentContent.title}" wurde gelöscht.`,
                recipientIds,
                actorName: currentUser?.name,
                actorId: currentUser?.id,
                link: '/content',
            });
        }
    }, [deleteContent, notify, currentUser, getCampaignRecipients]);

    // ── Audience Actions ──────────────────────────────

    const notifyAddAudience = useCallback(async (audience: Omit<Audience, 'id'>) => {
        await addAudience(audience);
        notify({
            type: 'audience_created',
            title: 'Neue Zielgruppe erstellt',
            message: `"${audience.name}" wurde angelegt.`,
            recipientIds: getManagerAdminIds(),
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/audiences',
        });
    }, [addAudience, notify, currentUser, getManagerAdminIds]);

    const notifyUpdateAudience = useCallback(async (id: string, updates: Partial<Audience>, audience?: Audience) => {
        await updateAudience(id, updates);
        notify({
            type: 'audience_updated',
            title: 'Zielgruppe aktualisiert',
            message: `"${audience?.name || 'Zielgruppe'}" wurde bearbeitet.`,
            recipientIds: getManagerAdminIds(),
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/audiences',
        });
    }, [updateAudience, notify, currentUser, getManagerAdminIds]);

    const notifyDeleteAudience = useCallback(async (id: string, audience?: Audience) => {
        await deleteAudience(id);
        notify({
            type: 'audience_deleted',
            title: 'Zielgruppe gelöscht',
            message: `"${audience?.name || 'Zielgruppe'}" wurde gelöscht.`,
            recipientIds: getManagerAdminIds(),
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/audiences',
        });
    }, [deleteAudience, notify, currentUser, getManagerAdminIds]);

    // ── Touchpoint Actions ────────────────────────────

    const notifyAddTouchpoint = useCallback(async (tp: Omit<Touchpoint, 'id'>) => {
        const created = await addTouchpoint(tp);
        notify({
            type: 'touchpoint_created',
            title: 'Neuer Touchpoint erstellt',
            message: `"${tp.name}" wurde angelegt.`,
            recipientIds: getManagerAdminIds(),
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/touchpoints',
        });
        return created;
    }, [addTouchpoint, notify, currentUser, getManagerAdminIds]);

    const notifyUpdateTouchpoint = useCallback(async (id: string, updates: Partial<Touchpoint>, tp?: Touchpoint) => {
        await updateTouchpoint(id, updates);
        notify({
            type: 'touchpoint_updated',
            title: 'Touchpoint aktualisiert',
            message: `"${tp?.name || 'Touchpoint'}" wurde bearbeitet.`,
            recipientIds: getManagerAdminIds(),
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/touchpoints',
        });
    }, [updateTouchpoint, notify, currentUser, getManagerAdminIds]);

    const notifyDeleteTouchpoint = useCallback(async (id: string, tp?: Touchpoint) => {
        await deleteTouchpoint(id);
        notify({
            type: 'touchpoint_deleted',
            title: 'Touchpoint gelöscht',
            message: `"${tp?.name || 'Touchpoint'}" wurde gelöscht.`,
            recipientIds: getManagerAdminIds(),
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/touchpoints',
        });
    }, [deleteTouchpoint, notify, currentUser, getManagerAdminIds]);

    // ── Positioning ───────────────────────────────────

    const notifySavePositioning = useCallback(async (pos: Parameters<typeof savePositioning>[0]) => {
        await savePositioning(pos);
        const managerIds = users.filter(u => u.role === 'manager').map(u => u.id);
        notify({
            type: 'positioning_updated',
            title: 'Positionierung aktualisiert',
            message: 'Die digitale Positionierung wurde aktualisiert.',
            recipientIds: managerIds,
            actorName: currentUser?.name,
            actorId: currentUser?.id,
            link: '/positioning',
        });
    }, [savePositioning, notify, currentUser, users]);

    return {
        // Campaign
        notifyAddCampaign,
        notifyUpdateCampaign,
        notifyDeleteCampaign,
        // Task
        notifyAddTask,
        notifyUpdateTask,
        notifyUpdateTaskStatus,
        notifyDeleteTask,
        notifyExecuteAiAgent,
        notifySendAiFeedback,
        notifyAnalyzeTask,
        // Content
        notifyAddContent,
        notifyUpdateContent,
        notifyDeleteContent,
        // Audience
        notifyAddAudience,
        notifyUpdateAudience,
        notifyDeleteAudience,
        // Touchpoint
        notifyAddTouchpoint,
        notifyUpdateTouchpoint,
        notifyDeleteTouchpoint,
        // Positioning
        notifySavePositioning,
    };
}
