import { createContext, useContext, useState } from 'react';
import { initialContents } from '../data/mockData';

const ContentContext = createContext();

// Content Status Model (6 steps)
// idea → planning → production → ready → scheduled → published
export const CONTENT_STATUSES = {
    idea: { label: 'Idee', color: '#94a3b8', icon: '💡' },
    planning: { label: 'In Planung', color: '#8b5cf6', icon: '📋' },
    production: { label: 'In Produktion', color: '#f59e0b', icon: '🔧' },
    ready: { label: 'Bereit', color: '#06b6d4', icon: '✅' },
    scheduled: { label: 'Eingeplant', color: '#6366f1', icon: '📅' },
    published: { label: 'Veröffentlicht', color: '#10b981', icon: '🚀' },
};

export const CONTENT_STATUS_ORDER = ['idea', 'planning', 'production', 'ready', 'scheduled', 'published'];

export function ContentProvider({ children }) {
    const [contents, setContents] = useState(initialContents);

    const addContent = (content) => {
        const newContent = {
            id: 'cnt' + Date.now(),
            createdAt: new Date().toISOString(),
            ...content,
        };
        setContents(prev => [...prev, newContent]);
        return newContent.id;
    };

    const updateContent = (id, updates) => {
        setContents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteContent = (id) => {
        setContents(prev => prev.filter(c => c.id !== id));
    };

    return (
        <ContentContext.Provider value={{ contents, addContent, updateContent, deleteContent }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContents = () => useContext(ContentContext);
