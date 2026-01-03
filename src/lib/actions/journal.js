import { store } from '../store';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const JournalActions = {
    addEntry: (agendaId, text, journalId = null) => {
        if (!text || !text.trim()) return;
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            // Migration / Initialization
                            let journals = agenda.journals || [];
                            if (!agenda.journals && agenda.journal) {
                                journals = [{ id: 'default', name: 'Main Journal', entries: agenda.journal }];
                            } else if (journals.length === 0) {
                                journals = [{ id: 'default', name: 'Main Journal', entries: [] }];
                            }

                            // Find target
                            let targetIdx = 0;
                            if (journalId) {
                                targetIdx = journals.findIndex(j => j.id === journalId);
                                if (targetIdx === -1) targetIdx = 0;
                            }

                            const newEntry = {
                                id: generateId(),
                                text: text.trim(),
                                createdAt: new Date().toISOString()
                            };

                            const updatedJournals = [...journals];
                            updatedJournals[targetIdx] = {
                                ...updatedJournals[targetIdx],
                                entries: [newEntry, ...(updatedJournals[targetIdx].entries || [])]
                            };

                            // clean legacy 'journal' key if we want, or keep it synced? 
                            // Let's migrate fully away from 'journal' key for these agendas.
                            const { journal, ...rest } = agenda;
                            return { ...rest, journals: updatedJournals };
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

    deleteEntry: (agendaId, entryId, journalId = null) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            let journals = agenda.journals || [];
                            if (!agenda.journals && agenda.journal) {
                                journals = [{ id: 'default', name: 'Main Journal', entries: agenda.journal }];
                            }

                            // If journalId provided, optimize
                            const updatedJournals = journals.map(j => {
                                if (journalId && j.id !== journalId) return j;
                                return {
                                    ...j,
                                    entries: j.entries.filter(e => e.id !== entryId)
                                };
                            });

                            const { journal, ...rest } = agenda;
                            return { ...rest, journals: updatedJournals };
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

    createJournal: (agendaId, name) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            // Migration Logic
                            let journals = agenda.journals || [];
                            if (!agenda.journals && agenda.journal) {
                                journals = [{ id: 'default', name: 'Journal Principal', entries: agenda.journal }];
                            } else if (journals.length === 0) {
                                journals = [{ id: 'default', name: 'Journal Principal', entries: [] }];
                            }

                            const newJournal = {
                                id: generateId(),
                                name,
                                entries: []
                            };

                            // Remove legacy key
                            const { journal, ...rest } = agenda;
                            return { ...rest, journals: [...journals, newJournal] };
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

    renameJournal: (agendaId, journalId, newName) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            // Migration Logic
                            let journals = agenda.journals || [];
                            if (!agenda.journals && agenda.journal) {
                                journals = [{ id: 'default', name: 'Journal Principal', entries: agenda.journal }];
                            } else if (journals.length === 0) {
                                journals = [{ id: 'default', name: 'Journal Principal', entries: [] }];
                            }

                            const updatedJournals = journals.map(j => {
                                if (j.id === journalId) return { ...j, name: newName };
                                return j;
                            });

                            // Remove legacy key
                            const { journal, ...rest } = agenda;
                            return { ...rest, journals: updatedJournals };
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

    deleteJournal: (agendaId, journalId) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;
            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(agenda => {
                        if (agenda.id === agendaId) {
                            // Migration Logic
                            let journals = agenda.journals || [];
                            if (!agenda.journals && agenda.journal) {
                                journals = [{ id: 'default', name: 'Journal Principal', entries: agenda.journal }];
                            }

                            const updatedJournals = journals.filter(j => j.id !== journalId);

                            // Remove legacy key
                            const { journal, ...rest } = agenda;
                            return { ...rest, journals: updatedJournals };
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
