import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationWatcher from './NotificationWatcher';

interface LayoutProps {
    children: ReactNode;
    onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
    return (
        <div className="app-layout">
            <NotificationWatcher />
            <Sidebar onLogout={onLogout} />
            <div className="app-main">
                <Header />
                <main className="app-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
