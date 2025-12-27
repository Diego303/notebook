/**
 * Persistence Layer
 * Handles interactions with LocalStorage, Schema Validation, and Import/Export
 * Includes deep validation and sanitization for data integrity
 */

const STORAGE_KEY = 'notebook_v1_state';
const SCHEMA_VERSION = 1;

// ============================================
// TYPE VALIDATORS (Pure functions)
// ============================================

const isString = (v) => typeof v === 'string';
const isNumber = (v) => typeof v === 'number' && !isNaN(v);
const isBoolean = (v) => typeof v === 'boolean';
const isArray = (v) => Array.isArray(v);
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isNullOrString = (v) => v === null || isString(v);
const isNullOrNumber = (v) => v === null || isNumber(v);
const isValidId = (v) => isString(v) && v.length > 0 && v.length < 100;
const isValidDate = (v) => isString(v) && !isNaN(Date.parse(v));

/**
 * Validates and trims a string, limiting its length.
 * Note: HTML escaping is NOT done here because this is a local-only app
 * and the data comes from the user's own machine. Escaping would corrupt
 * legitimate content like code snippets or notes with < > characters.
 */
function sanitizeString(str, maxLength = 10000) {
  if (!isString(str)) return '';
  // Trim whitespace and limit length
  return str.trim().slice(0, maxLength);
}

/**
 * Validates and sanitizes a single note/folder object.
 */
function validateNote(note, errors) {
  if (!isObject(note)) {
    errors.push('Note is not an object');
    return null;
  }

  const validated = {
    id: isValidId(note.id) ? note.id : null,
    type: note.type === 'folder' ? 'folder' : 'note',
    title: sanitizeString(note.title || '', 500),
    content: note.type === 'folder' ? undefined : sanitizeString(note.content || '', 100000),
    parentId: isNullOrString(note.parentId) ? note.parentId : null,
    createdAt: isValidDate(note.createdAt) ? note.createdAt : new Date().toISOString(),
    modifiedAt: isValidDate(note.modifiedAt) ? note.modifiedAt : new Date().toISOString()
  };

  if (!validated.id) {
    errors.push(`Note missing valid ID`);
    return null;
  }

  return validated;
}

/**
 * Validates and sanitizes a single task object.
 */
function validateTask(task, errors) {
  if (!isObject(task)) {
    errors.push('Task is not an object');
    return null;
  }

  const validPriorities = ['low', 'medium', 'high'];
  const validColumns = ['backlog', 'todo', 'doing', 'done'];

  const validated = {
    id: isValidId(task.id) ? task.id : null,
    title: sanitizeString(task.title || '', 500),
    description: sanitizeString(task.description || '', 10000),
    priority: validPriorities.includes(task.priority) ? task.priority : 'medium',
    dueDate: isNullOrString(task.dueDate) && (!task.dueDate || isValidDate(task.dueDate)) ? task.dueDate : null,
    columnId: validColumns.includes(task.columnId) ? task.columnId : 'backlog',
    createdAt: isValidDate(task.createdAt) ? task.createdAt : new Date().toISOString(),
    isFinalized: isBoolean(task.isFinalized) ? task.isFinalized : false,
    isDeleted: isBoolean(task.isDeleted) ? task.isDeleted : false,
    finalizedAt: isNullOrNumber(task.finalizedAt) ? task.finalizedAt : null,
    deletedAt: isNullOrNumber(task.deletedAt) ? task.deletedAt : null
  };

  if (!validated.id) {
    errors.push(`Task missing valid ID`);
    return null;
  }

  return validated;
}

/**
 * Validates a journal entry.
 */
function validateJournalEntry(entry, errors) {
  if (!isObject(entry)) return null;

  const validated = {
    id: isValidId(entry.id) ? entry.id : null,
    text: sanitizeString(entry.text || '', 50000),
    createdAt: isValidDate(entry.createdAt) ? entry.createdAt : new Date().toISOString()
  };

  if (!validated.id) return null;
  return validated;
}

/**
 * Validates a journal object.
 */
function validateJournal(journal, errors) {
  if (!isObject(journal)) return null;

  const validated = {
    id: isValidId(journal.id) ? journal.id : null,
    name: sanitizeString(journal.name || 'Journal', 200),
    entries: []
  };

  if (!validated.id) return null;

  if (isArray(journal.entries)) {
    journal.entries.forEach(entry => {
      const validEntry = validateJournalEntry(entry, errors);
      if (validEntry) validated.entries.push(validEntry);
    });
  }

  return validated;
}

/**
 * Validates a snippet object.
 */
function validateSnippet(snippet, errors) {
  if (!isObject(snippet)) return null;

  const validated = {
    id: isValidId(snippet.id) ? snippet.id : null,
    title: sanitizeString(snippet.title || '', 500),
    code: isString(snippet.code) ? snippet.code.slice(0, 100000) : '', // Don't sanitize code
    language: sanitizeString(snippet.language || 'text', 50),
    description: sanitizeString(snippet.description || '', 2000),
    tags: [],
    createdAt: isValidDate(snippet.createdAt) ? snippet.createdAt : new Date().toISOString()
  };

  if (!validated.id) return null;

  // Validate tags
  if (isArray(snippet.tags)) {
    snippet.tags.forEach(tag => {
      if (isString(tag) && tag.length > 0 && tag.length < 50) {
        validated.tags.push(sanitizeString(tag, 50));
      }
    });
  }

  return validated;
}

/**
 * Validates a Kanban column.
 */
function validateColumn(column, errors) {
  if (!isObject(column)) return null;

  const validated = {
    id: isValidId(column.id) ? column.id : null,
    title: sanitizeString(column.title || '', 100),
    taskIds: []
  };

  if (!validated.id) return null;

  if (isArray(column.taskIds)) {
    column.taskIds.forEach(id => {
      if (isValidId(id)) validated.taskIds.push(id);
    });
  }

  return validated;
}

/**
 * Validates metrics object.
 */
function validateMetrics(metrics) {
  if (!isObject(metrics)) return {};

  const validated = {};
  // Only allow known metric keys with numeric values
  const allowedKeys = ['focusDays', 'incidentsResolved', 'deepWorkDays'];
  allowedKeys.forEach(key => {
    if (isNumber(metrics[key])) {
      validated[key] = Math.max(0, Math.floor(metrics[key])); // Positive integers only
    }
  });

  return validated;
}

/**
 * Validates a complete agenda object.
 */
function validateAgenda(agenda, errors) {
  if (!isObject(agenda)) {
    errors.push('Agenda is not an object');
    return null;
  }

  const validated = {
    id: isValidId(agenda.id) ? agenda.id : null,
    name: sanitizeString(agenda.name || 'Untitled Agenda', 200),
    createdAt: isValidDate(agenda.createdAt) ? agenda.createdAt : new Date().toISOString(),
    notes: [],
    tasks: [],
    columns: [],
    journals: [],
    snippets: [],
    finalizedTasks: [],
    deletedTasks: [],
    metrics: validateMetrics(agenda.metrics)
  };

  if (!validated.id) {
    errors.push('Agenda missing valid ID');
    return null;
  }

  // Validate notes
  if (isArray(agenda.notes)) {
    agenda.notes.forEach(note => {
      const validNote = validateNote(note, errors);
      if (validNote) validated.notes.push(validNote);
    });
  }

  // Validate tasks
  if (isArray(agenda.tasks)) {
    agenda.tasks.forEach(task => {
      const validTask = validateTask(task, errors);
      if (validTask) validated.tasks.push(validTask);
    });
  }

  // Validate columns (with defaults)
  if (isArray(agenda.columns) && agenda.columns.length > 0) {
    agenda.columns.forEach(col => {
      const validCol = validateColumn(col, errors);
      if (validCol) validated.columns.push(validCol);
    });
  }
  // Ensure default columns exist
  const defaultCols = ['todo', 'doing', 'done'];
  defaultCols.forEach(colId => {
    if (!validated.columns.find(c => c.id === colId)) {
      validated.columns.push({ id: colId, title: colId.toUpperCase(), taskIds: [] });
    }
  });

  // Validate journals (with migration from legacy 'journal' array)
  if (isArray(agenda.journals)) {
    agenda.journals.forEach(journal => {
      const validJournal = validateJournal(journal, errors);
      if (validJournal) validated.journals.push(validJournal);
    });
  } else if (isArray(agenda.journal)) {
    // Migration: old format had 'journal' as array of entries
    const migratedJournal = {
      id: 'default',
      name: 'Main Journal',
      entries: []
    };
    agenda.journal.forEach(entry => {
      const validEntry = validateJournalEntry(entry, errors);
      if (validEntry) migratedJournal.entries.push(validEntry);
    });
    validated.journals.push(migratedJournal);
  }

  // Validate snippets
  if (isArray(agenda.snippets)) {
    agenda.snippets.forEach(snip => {
      const validSnip = validateSnippet(snip, errors);
      if (validSnip) validated.snippets.push(validSnip);
    });
  }

  // Validate finalized/deleted tasks
  if (isArray(agenda.finalizedTasks)) {
    agenda.finalizedTasks.forEach(task => {
      const validTask = validateTask(task, errors);
      if (validTask) validated.finalizedTasks.push(validTask);
    });
  }
  if (isArray(agenda.deletedTasks)) {
    agenda.deletedTasks.forEach(task => {
      const validTask = validateTask(task, errors);
      if (validTask) validated.deletedTasks.push(validTask);
    });
  }

  return validated;
}

/**
 * Validates a complete workspace object.
 */
function validateWorkspace(workspace, errors) {
  if (!isObject(workspace)) {
    errors.push('Workspace is not an object');
    return null;
  }

  const validated = {
    id: isValidId(workspace.id) ? workspace.id : null,
    name: sanitizeString(workspace.name || 'Untitled Workspace', 200),
    createdAt: isValidDate(workspace.createdAt) ? workspace.createdAt : new Date().toISOString(),
    modifiedAt: isValidDate(workspace.modifiedAt) ? workspace.modifiedAt : new Date().toISOString(),
    agendas: []
  };

  if (!validated.id) {
    errors.push('Workspace missing valid ID');
    return null;
  }

  if (isArray(workspace.agendas)) {
    workspace.agendas.forEach(agenda => {
      const validAgenda = validateAgenda(agenda, errors);
      if (validAgenda) validated.agendas.push(validAgenda);
    });
  }

  return validated;
}

/**
 * Deep validates the entire state structure.
 * @param {Object} state - The state object to validate.
 * @returns {{ valid: boolean, state: Object|null, errors: string[] }}
 */
function deepValidateState(state) {
  const errors = [];

  // Basic structure check
  if (!state || typeof state !== 'object') {
    return { valid: false, state: null, errors: ['State is not an object'] };
  }

  if (state.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`Schema version mismatch. Expected ${SCHEMA_VERSION}, got ${state.schemaVersion}`);
    return { valid: false, state: null, errors };
  }

  if (!isArray(state.workspaces)) {
    errors.push('State.workspaces is not an array');
    return { valid: false, state: null, errors };
  }

  // Build validated state
  const validated = {
    schemaVersion: SCHEMA_VERSION,
    workspaces: [],
    activeWorkspaceId: isNullOrString(state.activeWorkspaceId) ? state.activeWorkspaceId : null,
    activeAgendaId: isNullOrString(state.activeAgendaId) ? state.activeAgendaId : null
  };

  // Validate each workspace
  state.workspaces.forEach((ws, idx) => {
    const validWs = validateWorkspace(ws, errors);
    if (validWs) {
      validated.workspaces.push(validWs);
    } else {
      errors.push(`Workspace at index ${idx} was invalid and removed`);
    }
  });

  // Validate activeWorkspaceId exists
  if (validated.activeWorkspaceId) {
    const exists = validated.workspaces.find(ws => ws.id === validated.activeWorkspaceId);
    if (!exists) {
      errors.push('activeWorkspaceId references non-existent workspace, resetting');
      validated.activeWorkspaceId = null;
      validated.activeAgendaId = null;
    }
  }

  // Validate activeAgendaId exists within active workspace
  if (validated.activeAgendaId && validated.activeWorkspaceId) {
    const ws = validated.workspaces.find(w => w.id === validated.activeWorkspaceId);
    if (ws) {
      const exists = ws.agendas.find(a => a.id === validated.activeAgendaId);
      if (!exists) {
        errors.push('activeAgendaId references non-existent agenda, resetting');
        validated.activeAgendaId = null;
      }
    }
  }

  // Log any errors for debugging
  if (errors.length > 0) {
    console.warn('State validation had issues:', errors);
  }

  return { valid: true, state: validated, errors };
}

/**
 * Legacy simple validation (kept for compatibility, now calls deep validation).
 */
function validateSchema(state) {
  const result = deepValidateState(state);
  return result.valid;
}

/**
 * Saves the current state to LocalStorage.
 * @param {Object} state - The full application state object.
 */
export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save state to LocalStorage:', err);
  }
}

/**
 * Loads the state from LocalStorage with deep validation.
 * @returns {Object|null} - The validated state object or null if not found/invalid.
 */
export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const state = JSON.parse(serialized);
    const result = deepValidateState(state);

    if (!result.valid) {
      console.warn('Loaded state failed validation. Resetting.', result.errors);
      return null;
    }

    // Return the sanitized/validated state
    return result.state;
  } catch (err) {
    console.error('Failed to load state from LocalStorage:', err);
    return null;
  }
}

/**
 * Triggers a download of the current state as a JSON file.
 * @param {Object} state - The state to export.
 * @param {string} filename - The suggested filename.
 */
export function exportData(state, filename = `notebook-backup-${new Date().toISOString().split('T')[0]}.json`) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

/**
 * Parses and validates an imported JSON file content with deep validation.
 * @param {string} jsonString - The raw JSON string from a file.
 * @returns {Object} - The validated and sanitized state object.
 * @throws {Error} - If parsing fails or schema is invalid.
 */
export function parseImportData(jsonString) {
  let state;
  try {
    state = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('El archivo no es JSON válido.');
  }

  const result = deepValidateState(state);

  if (!result.valid) {
    throw new Error(`Archivo de backup inválido: ${result.errors.join(', ')}`);
  }

  // Return the sanitized state
  return result.state;
}

/**
 * Returns the default initial state structure.
 */
export function getInitialState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    workspaces: [],
    activeWorkspaceId: null,
    activeAgendaId: null
  };
}

