import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { useNotifications, type AppNotification, type NotificationPriority } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
    urgent: '#ef4444',
    high: '#f59e0b',
    medium: '#6366f1',
    low: '#94a3b8',
};

function timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'gerade eben';
    if (mins < 60) return `vor ${mins} Min.`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `vor ${hours} Std.`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'gestern';
    return `vor ${days} Tagen`;
}

function NotificationItem({ notification, onRead, onNavigate }: {
    notification: AppNotification;
    onRead: (id: string) => void;
    onNavigate: (link: string) => void;
}) {
    return (
        <div
            className="notification-item"
            style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                cursor: notification.link ? 'pointer' : 'default',
                background: notification.read ? 'transparent' : 'rgba(99, 102, 241, 0.04)',
                borderBottom: '1px solid var(--border-color)',
                transition: 'background 0.15s',
                borderLeft: `3px solid ${PRIORITY_COLORS[notification.priority]}`,
            }}
            onClick={() => {
                if (!notification.read) onRead(notification.id);
                if (notification.link) onNavigate(notification.link);
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = notification.read ? 'transparent' : 'rgba(99, 102, 241, 0.04)'; }}
        >
            <div style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>
                {notification.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: notification.read ? 400 : 600,
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                }}>
                    {notification.title}
                </div>
                <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-tertiary)',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {notification.message}
                </div>
                <div style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-tertiary)',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}>
                    <span>{timeAgo(notification.timestamp)}</span>
                    {notification.actorName && notification.actorName !== 'System' && (
                        <span>· {notification.actorName}</span>
                    )}
                </div>
            </div>
            {!notification.read && (
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    flexShrink: 0,
                    marginTop: '6px',
                }} />
            )}
        </div>
    );
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { currentUser } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

    const myNotifications = currentUser
        ? notifications.filter(n => n.recipientId === currentUser.id).slice(0, 50)
        : [];

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const handleNavigate = (link: string) => {
        setIsOpen(false);
        router.push(link);
    };

    return (
        <div ref={panelRef} style={{ position: 'relative' }}>
            <button
                className="header-icon-btn"
                title="Benachrichtigungen"
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: 'relative' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '8px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                        lineHeight: 1,
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '400px',
                    maxHeight: '500px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease-out',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border-color)',
                        background: 'var(--bg-elevated)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                                Benachrichtigungen
                            </span>
                            {unreadCount > 0 && (
                                <span style={{
                                    background: 'rgba(99, 102, 241, 0.12)',
                                    color: 'var(--color-primary)',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                }}>
                                    {unreadCount} neu
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {unreadCount > 0 && (
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={markAllAsRead}
                                    title="Alle als gelesen markieren"
                                    style={{ padding: '4px 8px', fontSize: 'var(--font-size-xs)' }}
                                >
                                    <CheckCheck size={14} /> Alle gelesen
                                </button>
                            )}
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setIsOpen(false)}
                                style={{ padding: '4px' }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notification list */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        maxHeight: '380px',
                    }}>
                        {myNotifications.length === 0 ? (
                            <div style={{
                                padding: '48px 24px',
                                textAlign: 'center',
                                color: 'var(--text-tertiary)',
                            }}>
                                <Bell size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                                    Keine Benachrichtigungen
                                </div>
                                <div style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
                                    Hier erscheinen deine Benachrichtigungen
                                </div>
                            </div>
                        ) : (
                            myNotifications.map(n => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onRead={markAsRead}
                                    onNavigate={handleNavigate}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {myNotifications.length > 0 && (
                        <div style={{
                            padding: '10px 16px',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'var(--bg-elevated)',
                        }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => { clearAll(); }}
                                style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', padding: '4px 8px' }}
                            >
                                <Trash2 size={12} /> Alle löschen
                            </button>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => { setIsOpen(false); router.push('/settings'); }}
                                style={{ fontSize: 'var(--font-size-xs)', padding: '4px 8px' }}
                            >
                                Einstellungen
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
