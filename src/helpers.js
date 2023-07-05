export const completedTodosCheck = (todosArray) => todosArray
  .every(todo => todo.completed);
