/**
 * Agenda Actions
 * Logic for managing agendas within the active workspace.
 */
import { store } from '../store';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const AgendaActions = {
    /**
     * Creates a new agenda in the active workspace.
     * @param {string} name - Name of the agenda.
     */
    createAgenda: (name) => {
        if (!name || !name.trim()) return;

        store.update((state) => {
            const activeId = state.activeWorkspaceId;
            if (!activeId) return; // Should not happen if UI is correct

            const newAgenda = {
                id: generateId(),
                name: name.trim(),
                createdAt: new Date().toISOString(),
                notes: [], // Initialize sub-collections
                tasks: [],
                columns: [ // Default Kanban columns
                    { id: 'todo', title: 'To Do', taskIds: [] },
                    { id: 'doing', title: 'In Progress', taskIds: [] },
                    { id: 'done', title: 'Done', taskIds: [] }
                ]
            };

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeId) {
                    return {
                        ...ws,
                        agendas: [...(ws.agendas || []), newAgenda],
                        modifiedAt: new Date().toISOString()
                    };
                }
                return ws;
            });

            return { workspaces };
        });
    },

    /**
     * Deletes an agenda from the active workspace.
     * @param {string} agendaId 
     */
    deleteAgenda: (agendaId) => {
        store.update((state) => {
            const activeId = state.activeWorkspaceId;
            if (!activeId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeId) {
                    return {
                        ...ws,
                        agendas: ws.agendas.filter(a => a.id !== agendaId),
                        modifiedAt: new Date().toISOString()
                    };
                }
                return ws;
            });

            return { workspaces };
        });
    },

    /**
     * Renames an agenda.
     * @param {string} agendaId 
     * @param {string} newName 
     */
    renameAgenda: (agendaId, newName) => {
        if (!newName || !newName.trim()) return;

        store.update((state) => {
            const activeId = state.activeWorkspaceId;
            if (!activeId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeId) {
                    const updatedAgendas = ws.agendas.map(a => {
                        if (a.id === agendaId) {
                            return { ...a, name: newName.trim() };
                        }
                        return a;
                    });
                    return { ...ws, agendas: updatedAgendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });

            return { workspaces };
        });
    },

    /**
     * Sets the active agenda.
     * @param {string} id - Agenda ID.
     */
    selectAgenda: (id) => {
        store.update((state) => {
            return { activeAgendaId: id };
        });
    }
};

