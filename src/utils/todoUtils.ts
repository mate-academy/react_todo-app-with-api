import { OptionsTodos } from '../constans';
import { Todo } from '../types/Todo';

export const getTodosByOptions = (option: OptionsTodos, todos: Todo[]) => {
  switch (option) {
    case OptionsTodos.COMPLETED:
      return todos.filter(todo => todo.completed);

    case OptionsTodos.ACTIVE:
      return todos.filter(todo => !todo.completed);
  }

  return todos;
};

export const getTodos = {
  active: (todos: Todo[]) => todos.filter(todo => !todo.completed).length,

  isOneCompleted: (todos: Todo[]) => todos.some(todo => todo.completed),

  isEveryCompleted: (todos: Todo[]) => todos.every(todo => todo.completed),

  isEveryNotCompleted: (todos: Todo[]) => todos.every(todo => !todo.completed),

  allCompletedId: (todos: Todo[]) =>
    todos.filter(todo => todo.completed).map(todo => todo.id),
};

export const getToggleAll = (todos: Todo[]) => {
  const filterTodos = todos.filter(todo => !todo.completed);

  const changeTodos = (newTodos: Todo[], completed: boolean) =>
    newTodos.map(({ id, userId, title }) => ({
      id,
      userId,
      title,
      completed: completed,
    }));

  switch (true) {
    case getTodos.isEveryCompleted(todos):
      return changeTodos(todos, false);

    case getTodos.isEveryNotCompleted(todos):
      return changeTodos(todos, true);
  }

  return changeTodos(filterTodos, true);
};
