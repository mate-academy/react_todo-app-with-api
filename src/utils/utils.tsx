import { USER_ID } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const items = {
  completed(todos: Todo[]) {
    return todos.filter(todo => todo.completed);
  },

  uncompleted(todos: Todo[]) {
    return todos.filter(todo => !todo.completed);
  },

  filter(todos: Todo[], filter: Filter) {
    switch (filter) {
      case Filter.active:
        return this.uncompleted(todos);
      case Filter.completed:
        return this.completed(todos);
      default:
        return todos;
    }
  },
};

export function createNewTodo(newTitle: string, isCompleted: boolean, id = 0) {
  return {
    id,
    userId: USER_ID,
    title: newTitle,
    completed: isCompleted,
  };
}

export const getButtonText = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function isTodoLoading(id: number, loadingTodos: Todo[]) {
  const loadingTodo = loadingTodos.find(todo => todo.id === id);

  return Boolean(loadingTodo);
}
