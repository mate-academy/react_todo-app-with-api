const ERROR_MESSAGES = {
  loadTodos: 'Unable to load todos',
  addTodo: 'Unable to add a todo',
  updateTodo: 'Unable to update a todo',
  deleteTodo: 'Unable to delete a todo',
  emptyTitle: 'Title should not be empty',
} as const;

type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

export { ERROR_MESSAGES, type ErrorMessage };
