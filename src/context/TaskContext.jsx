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
            if (newStatus === 'monitoring') {
                updated.performance = { impressions: Math.floor(Math.random() * 20000) + 3000, clicks: Math.floor(Math.random() * 2000) + 200, ctr: +(Math.random() * 8 + 1).toFixed(1) };
            }
            return updated;
        }));
    };

    // KI-Agent Pipeline: Erstgenerierung (Mock)
    const executeAiAgent = (id, prompt, taskType) => {
        setTasks(prev => prev.map(c => c.id === id ? { ...c, status: 'ai_generating', aiPrompt: prompt } : c));
        
        setTimeout(() => {
            setTasks(prev => prev.map(c => {
                if (c.id !== id) return c;
                
                let resultText = '';
                if (taskType === 'Video' || taskType === 'Post (Foto)' || taskType === 'Karousell') {
                    resultText = `[KI INFO]: Asset/Konzept für "${taskType}" wurde generiert und an den verknüpften OneDrive-Ordner übergeben.`;
                } else {
                    resultText = `(Generierter Entwurf basierend auf Typ '${taskType}')\n\nHeadline: Dein IT-Einstieg startet heute!\nBody: Entdecke, wie du ohne Vorkenntnisse in die Software-QA kommst. Sicher dir deinen Bildungsgutschein...\n\nCall-To-Action: Jetzt beim Webinar anmelden!`;
                }

                return {
                    ...c,
                    status: 'ai_ready',
                    aiSuggestion: resultText,
                };
            }));
        }, 2000);
    };

    // KI-Agent Pipeline: Feedback Loop (Mock)
    const sendAiFeedback = (id, feedback) => {
        setTasks(prev => prev.map(c => c.id === id ? { ...c, status: 'revision' } : c));
        
        setTimeout(() => {
            setTasks(prev => prev.map(c => {
                if (c.id !== id) return c;
                return {
                    ...c,
                    status: 'ai_ready',
                    aiSuggestion: `(Überarbeiteter Entwurf nach Feedback: "${feedback}")\n\nHeadline: Starte deine neue Karriere als Tester!\nBody: Einfacher, emotionaler und praxisnäher. Du brauchst keine Vorkenntnisse für diesen Job...\n\nCall-To-Action: Kostenloses Webinar sichern!`,
                };
            }));
        }, 1500);
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
        <TaskContext.Provider value={{ tasks, addTask, updateTask, updateTaskStatus, executeAiAgent, sendAiFeedback, analyzeTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => useContext(TaskContext);
