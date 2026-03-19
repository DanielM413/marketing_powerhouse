'use client';

import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ContentProvider } from '@/context/ContentContext';
import { TaskProvider } from '@/context/TaskContext';
import { DataProvider } from '@/context/DataContext';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <NotificationProvider>
                <DataProvider>
                    <ContentProvider>
                        <TaskProvider>
                            {children}
                        </TaskProvider>
                    </ContentProvider>
                </DataProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}
