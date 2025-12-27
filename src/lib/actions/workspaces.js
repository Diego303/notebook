/**
 * Workspace Actions
 * Contains logic for creating, updating, deleting, and selecting workspaces.
 */
import { store } from '../store';

/**
 * Generates a unique ID for new items.
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const WorkspaceActions = {
    /**
     * Creates a new workspace.
     * @param {string} name - Name of the workspace.
     */
    createWorkspace: (name) => {
        if (!name || !name.trim()) return;

        store.update((state) => {
            const newWorkspace = {
                id: generateId(),
                name: name.trim(),
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                agendas: [] // Initialize with empty agendas list
            };

            const updatedWorkspaces = [...state.workspaces, newWorkspace];

            // If it's the first workspace, automatically select it? 
            // User requirements say "Se crea vacío", doesn't explicitly say auto-select, but usually good UX.
            // Let's keep it manual selection for now to match "Select workspace" requirement explicitly,
            // or we can auto-select if activeWorkspaceId is null.
            let activeId = state.activeWorkspaceId;
            if (!activeId) {
                activeId = newWorkspace.id;
            }

            return {
                workspaces: updatedWorkspaces,
                activeWorkspaceId: activeId
            };
        });
    },

    /**
     * Renames an existing workspace.
     * @param {string} id - Workspace ID.
     * @param {string} newName - New name.
     */
    renameWorkspace: (id, newName) => {
        if (!newName || !newName.trim()) return;

        store.update((state) => {
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === id) {
                    return { ...ws, name: newName.trim(), modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    },

    /**
     * Deletes a workspace.
     * @param {string} id - Workspace ID.
     */
    deleteWorkspace: (id) => {
        store.update((state) => {
            const workspaces = state.workspaces.filter(ws => ws.id !== id);
            let activeId = state.activeWorkspaceId;

            if (activeId === id) {
                activeId = null; // Deselect if deleted
            }

            return { workspaces, activeWorkspaceId: activeId, activeAgendaId: null };
        });
    },

    /**
     * Sets the active workspace.
     * @param {string} id - Workspace ID.
     */
    selectWorkspace: (id) => {
        store.update((state) => {
            // Validate ID exists
            const exists = state.workspaces.find(ws => ws.id === id);
            if (exists || id === null) {
                return { activeWorkspaceId: id, activeAgendaId: null };
            }
            return {};
        });
    }
};
