export const MAIN_PHRASES = {
  // Header and input
  headerTitle: 'todos app',
  inputPlaceholder: 'What needs to be done?',

  // Footer
  footerItemsLeft: '{count} {noun} left',
  buttonClearCompleted: 'Clear completed',

  // Filters
  filterAll: 'All',
  filterActive: 'Active',
  filterCompleted: 'Completed',

  // Nouns
  nounItem: 'item',
  nounItems: 'items',
  nounTodo: 'todo',
  nounTodos: 'todos',
} as const;

export const ERROR_MESSAGE = {
  // Errors
  errorLoadFailed: 'Unable to load todos',
  errorAddFailed: 'Unable to add a todo',
  errorEmptyTitle: 'Title should not be empty',
  errorUpdateFailed: 'Unable to update a todo',
  errorBulkUpdateFailed: 'Unable to update {count} {noun}',
  errorDeleteFailed: 'Unable to delete a todo',
  errorBulkDeleteFailed: 'Unable to delete {count} {noun}',

  default: '',
} as const;
