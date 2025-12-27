import { store } from '../store';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const SnippetActions = {
    createSnippet: (agendaId, data) => {
        // data: { title, code, language, description, tags }
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(ag => {
                        if (ag.id === agendaId) {
                            const newSnip = {
                                id: generateId(),
                                title: data.title || 'Untitled Snippet',
                                code: data.code || '',
                                language: data.language || 'text',
                                description: data.description || '',
                                tags: data.tags || [],
                                createdAt: new Date().toISOString()
                            };
                            return { ...ag, snippets: [newSnip, ...(ag.snippets || [])] };
                        }
                        return ag;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    },

    deleteSnippet: (agendaId, snippetId) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(ag => {
                        if (ag.id === agendaId) {
                            return { ...ag, snippets: (ag.snippets || []).filter(s => s.id !== snippetId) };
                        }
                        return ag;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    },

    updateSnippet: (agendaId, snippetId, updates) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(ag => {
                        if (ag.id === agendaId) {
                            const newSnips = (ag.snippets || []).map(s => {
                                if (s.id === snippetId) return { ...s, ...updates };
                                return s;
                            });
                            return { ...ag, snippets: newSnips };
                        }
                        return ag;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    }
};
