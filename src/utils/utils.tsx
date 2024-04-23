import { USER_ID } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const items = {
  filter(todos: Todo[], filter: Filter) {
    switch (filter) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);
      case Filter.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },
  completed(todos: Todo[]) {
    return todos.filter(todo => todo.completed);
  },

  uncompleted(todos: Todo[]) {
    return todos.filter(todo => !todo.completed);
  },
};

export const item = {
  createNew(newTitle: string, isCompleted: boolean) {
    return {
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: isCompleted,
    };
  },
};

export const getButtonText = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function isTodoLoading(id: number, loadingTodos: Todo[]) {
  const loadingTodo = loadingTodos.find(todo => todo.id === id);

  return Boolean(loadingTodo);
}
