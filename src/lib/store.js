/**
 * Global State Store
 * Implements a simple subscriber pattern (Observer) for state management.
 */
import { saveState, loadState, getInitialState } from './persistence';

class Store {
    constructor() {
        this.state = getInitialState();
        this.listeners = new Set();
        this.initialized = false;
    }

    /**
     * Initialize the store. Tries to load from LocalStorage first.
     */
    init() {
        if (this.initialized) return;

        const loaded = loadState();
        if (loaded) {
            this.state = loaded;
        } else {
            this.state = getInitialState();
            saveState(this.state);
        }

        this.initialized = true;
        this.notify();
    }

    /**
     * Get the current state snapshot.
     * @returns {Object} - Read-only copy of state (shallow copy usually sufficient for read).
     *   @property {Array<Object>} workspaces - Array of workspace objects
     *   @property {string|null} activeWorkspaceId - ID of the currently active workspace
     *   @property {string|null} activeAgendaId - ID of the currently active agenda
     */
    getState() {
        return this.state;
    }

    /**
     * Subscribe to state changes.
     * @param {Function} listener - Function to be called when state changes.
     * @returns {Function} - Unsubscribe function.
     */
    subscribe(listener) {
        this.listeners.add(listener);
        // Call immediately with current state
        listener(this.state);

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Notify all listeners of a state change.
     */
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    /**
     * Generic dispatch method to update state.
     * In a complex app, we'd use named actions. Here we'll allow direct updates via reducer-like functions.
     * @param {Function} updateFn - Function that receives current state and returns new partial state or modifies draft.
     */
    update(updateFn) {
        // We'll do a simplified immutable update pattern
        // Ideally use structuredClone for deep copy if state is complex, for MVP shallow copy + disciplined updates might suffice,
        // but let's be safe and clone to avoid reference bugs.
        const nextState = structuredClone(this.state);

        const result = updateFn(nextState);

        // If updateFn returns a new object, use it. Otherwise assume it mutated nextState in place.
        if (result && typeof result === 'object') {
            this.state = { ...nextState, ...result };
        } else {
            this.state = nextState;
        }

        saveState(this.state);
        this.notify();
    }
}

// Singleton instance
export const store = new Store();
