import { createContext, useContext, useState } from 'react';
import { initialTasks } from '../data/mockData';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(initialTasks);

    const addTask = (task) => {
        setTasks(prev => [...prev, { id: 't' + Date.now(), ...task }]);
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(prev => prev.map(c => {
            if (c.id !== id) return c;
            const updated = { ...c, status: newStatus };
            if (newStatus === 'ai_generating') {
                setTimeout(() => {
                    setTasks(p => p.map(cc => cc.id === id ? {
                        ...cc, status: 'ai_ready',
                        aiSuggestion: `KI-Vorschlag für "${cc.title}": Headline: "Dein Einstieg in die IT beginnt hier." Body: Nutze emotionale Ansprache, zeige den Weg vom Jobsuchenden zum zertifizierten Tester. Abschluss mit klarem CTA zum kostenlosen Webinar.`
                    } : cc));
                }, 2000);
            }
            if (newStatus === 'monitoring') {
                updated.performance = { impressions: Math.floor(Math.random() * 20000) + 3000, clicks: Math.floor(Math.random() * 2000) + 200, ctr: +(Math.random() * 8 + 1).toFixed(1) };
            }
            return updated;
        }));
    };

    const analyzeTask = (id) => {
        setTasks(prev => prev.map(c => {
            if (c.id !== id) return c;
            const isGood = c.performance && c.performance.ctr > 3;
            return {
                ...c, status: 'analyzed',
                analysisResult: {
                    verdict: isGood ? 'good' : 'needs_improvement',
                    text: isGood
                        ? `CTR von ${c.performance.ctr}% liegt über dem Benchmark (3%). Empfehlung: Budget erhöhen und ähnliche Creatives erstellen.`
                        : `CTR von ${c.performance.ctr}% liegt unter dem Benchmark (3%). Empfehlung: Headline A/B-Test durchführen und Visual überarbeiten.`,
                }
            };
        }));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, updateTaskStatus, analyzeTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => useContext(TaskContext);
