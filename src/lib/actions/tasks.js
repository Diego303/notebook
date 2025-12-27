/**
 * Task Actions
 * Logic for managing tasks within the selected agenda.
 */
import { store } from '../store';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const TaskActions = {
  /**
   * Creates a new task.
   * @param {string} agendaId
   * @param {Object} taskData - { title, description, priority, dueDate }
   */
  createTask: (agendaId, taskData) => {
    if (!taskData.title || !taskData.title.trim()) return;

    store.update((state) => {
      const activeWsId = state.activeWorkspaceId;
      if (!activeWsId) return;

      const workspaces = state.workspaces.map(ws => {
        if (ws.id === activeWsId) {
          const agendas = ws.agendas.map(agenda => {
            if (agenda.id === agendaId) {
              const newTask = {
                id: generateId(),
                title: taskData.title.trim(),
                description: taskData.description || '',
                priority: taskData.priority || 'medium', // low, medium, high
                dueDate: taskData.dueDate || null,
                createdAt: new Date().toISOString(),
                columnId: 'backlog' // Default to BACKLOG now
              };

              const newTasks = [...(agenda.tasks || []), newTask];

              // Ensure we have a backlog column if it doesn't exist (migrations)
              let columns = agenda.columns || [];
              if (!columns.find(c => c.id === 'backlog')) {
                columns = [{ id: 'backlog', title: 'Backlog', taskIds: [] }, ...columns];
              }

              const newColumns = columns.map(col => {
                if (col.id === 'backlog') {
                  return { ...col, taskIds: [...(col.taskIds || []), newTask.id] };
                }
                return col;
              });

              return {
                ...agenda,
                tasks: newTasks,
                columns: newColumns
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

  /**
   * Moves a task to a different column (and optionally new index).
   * @param {string} agendaId
   * @param {string} taskId
   * @param {string} targetColumnId
   * @param {number} newIndex - Index in the target column
   */
  moveTask: (agendaId, taskId, targetColumnId, newIndex) => {
    store.update((state) => {
      const activeWsId = state.activeWorkspaceId;
      if (!activeWsId) return;

      const workspaces = state.workspaces.map(ws => {
        if (ws.id === activeWsId) {
          const agendas = ws.agendas.map(agenda => {
            if (agenda.id === agendaId) {
              // 1. Find Task
              const task = agenda.tasks.find(t => t.id === taskId);
              if (!task) return agenda;

              // Ensure columns exist (robustness)
              let columns = agenda.columns || [];
              if (!columns.find(c => c.id === 'backlog')) {
                columns = [{ id: 'backlog', title: 'Backlog', taskIds: [] }, ...columns];
              }

              // 2. Remove from old column
              const oldColumnId = task.columnId || 'backlog'; // Fallback
              const newColumns = columns.map(col => {
                if (col.id === oldColumnId) {
                  return { ...col, taskIds: (col.taskIds || []).filter(id => id !== taskId) };
                }
                return col;
              });

              // 3. Update task column property
              const updatedTask = { ...task, columnId: targetColumnId };
              const updatedTasks = agenda.tasks.map(t => t.id === taskId ? updatedTask : t);

              // 4. Insert into new column at index
              const targetColIndex = newColumns.findIndex(c => c.id === targetColumnId);
              if (targetColIndex !== -1) {
                const col = newColumns[targetColIndex];
                const newTaskIds = [...(col.taskIds || [])];

                const insertIndex = (newIndex >= 0 && newIndex <= newTaskIds.length) ? newIndex : newTaskIds.length;

                newTaskIds.splice(insertIndex, 0, taskId);
                newColumns[targetColIndex] = { ...col, taskIds: newTaskIds };
              }

              return { ...agenda, tasks: updatedTasks, columns: newColumns };
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

  deleteTask: (agendaId, taskId) => {
    store.update((state) => {
      const activeWsId = state.activeWorkspaceId;
      if (!activeWsId) return;

      const workspaces = state.workspaces.map(ws => {
        if (ws.id === activeWsId) {
          const agendas = ws.agendas.map(agenda => {
            if (agenda.id === agendaId) {
              const newTasks = agenda.tasks.filter(t => t.id !== taskId);
              const newColumns = (agenda.columns || []).map(col => ({
                ...col,
                taskIds: (col.taskIds || []).filter(id => id !== taskId)
              }));
              return { ...agenda, tasks: newTasks, columns: newColumns };
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

  updateTask: (agendaId, taskId, updates) => {
    store.update((state) => {
      const activeWsId = state.activeWorkspaceId;
      if (!activeWsId) return;

      const workspaces = state.workspaces.map(ws => {
        if (ws.id === activeWsId) {
          const agendas = ws.agendas.map(agenda => {
            if (agenda.id === agendaId) {
              const updatedTasks = agenda.tasks.map(t => {
                if (t.id === taskId) {
                  return { ...t, ...updates }; // Simple merge
                }
                return t;
              });
              return { ...agenda, tasks: updatedTasks };
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

  finalizeTask: (agendaId, taskId) => {
    store.update(state => {
      const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
      if (!ws) return;
      const agenda = ws.agendas.find(a => a.id === agendaId);
      if (!agenda) return;

      const taskIdx = agenda.tasks.findIndex(t => t.id === taskId);
      if (taskIdx === -1) return;
      const task = agenda.tasks[taskIdx];

      // Remove from main tasks
      agenda.tasks.splice(taskIdx, 1);

      // Remove from column
      const col = agenda.columns.find(c => c.id === task.columnId);
      if (col) {
        col.taskIds = col.taskIds.filter(id => id !== taskId);
      }

      // Add to finalizedTasks
      if (!agenda.finalizedTasks) agenda.finalizedTasks = [];
      task.finalizedAt = Date.now();
      agenda.finalizedTasks.push(task);

      ws.modifiedAt = new Date().toISOString();
      return state;
    });
  },

  recycleTask: (agendaId, taskId) => {
    store.update(state => {
      const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
      if (!ws) return;
      const agenda = ws.agendas.find(a => a.id === agendaId);
      if (!agenda) return;

      let taskIdx = agenda.tasks.findIndex(t => t.id === taskId);
      let task = null;

      if (taskIdx > -1) {
        task = agenda.tasks[taskIdx];
        agenda.tasks.splice(taskIdx, 1);
        const col = agenda.columns.find(c => c.id === task.columnId);
        if (col) col.taskIds = col.taskIds.filter(id => id !== taskId);
      } else if (agenda.finalizedTasks) {
        taskIdx = agenda.finalizedTasks.findIndex(t => t.id === taskId);
        if (taskIdx > -1) {
          task = agenda.finalizedTasks[taskIdx];
          agenda.finalizedTasks.splice(taskIdx, 1);
        }
      }

      if (!task) return;

      if (!agenda.deletedTasks) agenda.deletedTasks = [];
      task.deletedAt = Date.now();
      agenda.deletedTasks.push(task);

      ws.modifiedAt = new Date().toISOString();
      return state;
    });
  },

  restoreTask: (agendaId, taskId) => {
    store.update(state => {
      const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
      if (!ws) return;
      const agenda = ws.agendas.find(a => a.id === agendaId);
      if (!agenda) return;

      if (!agenda.deletedTasks) return;
      const taskIdx = agenda.deletedTasks.findIndex(t => t.id === taskId);
      if (taskIdx === -1) return;

      const task = agenda.deletedTasks[taskIdx];
      agenda.deletedTasks.splice(taskIdx, 1);

      // Default to Backlog
      task.columnId = 'backlog';
      delete task.deletedAt;
      delete task.finalizedAt;

      agenda.tasks.push(task);

      // Ensure backlog column logic in View will pick it up or we add to column here?
      // Since 'backlog' isn't always in columns array persisted, we rely on view logic or ensuring it.
      // Better to ensure it here if consistent with createTask.
      let columns = agenda.columns || [];
      const backlog = columns.find(c => c.id === 'backlog');
      if (backlog) {
        backlog.taskIds.push(task.id);
      } else {
        // If backlog doesn't exist in columns yet, create it?
        // Or rely on view to synthesize it. 
        // View synthesizes it: if(!columns.find(c => c.id === 'backlog')) ...
        // So just pushing to tasks with columnId='backlog' is enough.
      }

      ws.modifiedAt = new Date().toISOString();
      return state;
    });
  },

  permanentDeleteTask: (agendaId, taskId) => {
    store.update(state => {
      const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);
      if (!ws) return;
      const agenda = ws.agendas.find(a => a.id === agendaId);
      if (!agenda) return;

      if (agenda.deletedTasks) {
        agenda.deletedTasks = agenda.deletedTasks.filter(t => t.id !== taskId);
      }
      ws.modifiedAt = new Date().toISOString();
      return state;
    });
  }
};
