import { store } from '../store';

export const MetricsActions = {
    updateMetric: (agendaId, key, value) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(ag => {
                        if (ag.id === agendaId) {
                            const metrics = { ...(ag.metrics || {}) };
                            metrics[key] = value;
                            return { ...ag, metrics };
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

    incrementMetric: (agendaId, key) => {
        store.update(state => {
            const activeWsId = state.activeWorkspaceId;
            if (!activeWsId) return;

            const workspaces = state.workspaces.map(ws => {
                if (ws.id === activeWsId) {
                    const agendas = ws.agendas.map(ag => {
                        if (ag.id === agendaId) {
                            const metrics = { ...(ag.metrics || {}) };
                            const current = typeof metrics[key] === 'number' ? metrics[key] : 0;
                            metrics[key] = current + 1;
                            return { ...ag, metrics };
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
