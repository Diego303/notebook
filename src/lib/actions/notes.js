/**
 * Note Actions
 * Logic for managing notes within the selected agenda.
 */
import { store } from '../store';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const NoteActions = {
    /**
     * Creates a new note in the specified agenda.
     * @param {string} agendaId - ID of the agenda.
     * @param {string} title - Initial title.
     * @param {string} content - Initial content.
     * @param {string} [customId] - Optional explicit ID.
     */
    createNote: (agendaId, title = 'Untitled Note', content = '', customId = null, parentId = null) => {
        store.update((state) => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            const newNote = {
                                id: customId || generateId(),
                                type: 'note',
                                title,
                                content,
                                parentId, // null for root, or folderId
                                createdAt: new Date().toISOString(),
                                modifiedAt: new Date().toISOString()
                            };
                            return {
                                ...agenda,
                                notes: [...(agenda.notes || []), newNote]
                            };
                        }
                        return agenda;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });

            return { workspaces };
        });
    },

    createFolder: (agendaId, name, parentId = null) => {
        store.update((state) => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            const newFolder = {
                                id: generateId(),
                                type: 'folder',
                                title: name, // Using title for consistency
                                parentId,
                                createdAt: new Date().toISOString(),
                                modifiedAt: new Date().toISOString()
                            };
                            return {
                                ...agenda,
                                notes: [...(agenda.notes || []), newFolder]
                            };
                        }
                        return agenda;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    },

    updateNote: (agendaId, noteId, updates) => {
        store.update((state) => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            const notes = agenda.notes.map(note => {
                                if (note.id === noteId) {
                                    return {
                                        ...note,
                                        ...updates,
                                        modifiedAt: new Date().toISOString()
                                    };
                                }
                                return note;
                            });
                            return { ...agenda, notes };
                        }
                        return agenda;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    },

    /**
     * Recursive delete logic helper
     */
    deleteItem: (agendaId, itemId) => {
        store.update((state) => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            // Find all IDs to delete (item + recursive children)
                            const allNotes = agenda.notes || [];
                            const toDelete = new Set([itemId]);

                            // Iteratively find children
                            let changed = true;
                            while (changed) {
                                changed = false;
                                allNotes.forEach(n => {
                                    if (n.parentId && toDelete.has(n.parentId) && !toDelete.has(n.id)) {
                                        toDelete.add(n.id);
                                        changed = true;
                                    }
                                });
                            }

                            const notes = allNotes.filter(n => !toDelete.has(n.id));
                            return { ...agenda, notes };
                        }
                        return agenda;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    },

    // Alias for consistency if called as deleteNote
    deleteNote: (agendaId, noteId) => {
        // We use the same recursive delete function
        // Since 'deleteItem' is defined inside this object literal in the same scope, 
        // we can recursively call NoteActions.deleteItem.
        // However, 'this' context might be tricky if destructured. 
        // Best to just duplicate logic or call internal helper? 
        // Simpler: Just allow calling deleteItem from UI.
        return NoteActions.deleteItem(agendaId, noteId);
    },

    moveItem: (agendaId, itemId, newParentId) => {
        store.update((state) => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            // Check if moving folder into itself or its children (cycle prevention)
                            const allNotes = agenda.notes || [];
                            const item = allNotes.find(n => n.id === itemId);
                            if (!item) return agenda;

                            if (item.type === 'folder') {
                                let current = newParentId;
                                while (current) {
                                    if (current === itemId) return agenda; // Cycle detected
                                    const p = allNotes.find(n => n.id === current);
                                    current = p ? p.parentId : null;
                                }
                            }

                            const notes = allNotes.map(n => {
                                if (n.id === itemId) return { ...n, parentId: newParentId, modifiedAt: new Date().toISOString() };
                                return n;
                            });
                            return { ...agenda, notes };
                        }
                        return agenda;
                    });
                    return { ...ws, agendas, modifiedAt: new Date().toISOString() };
                }
                return ws;
            });
            return { workspaces };
        });
    }
};
