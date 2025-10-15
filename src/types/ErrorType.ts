export enum ErrorType {
  UNABLE_TO_LOAD_TODOS = 'Unable to load todos',
  UNABLE_TO_ADD_TODO = 'Unable to add a todo',
  UNABLE_TO_DELETE_TODO = 'Unable to delete a todo',
  UNABLE_TO_UPDATE_TODO = 'Unable to update a todo', // ✅ добавили новую ошибку
  EMPTY_TITLE = 'Title should not be empty',
  LOAD = 'load',
  UNKNOWN = 'unknown',
}
