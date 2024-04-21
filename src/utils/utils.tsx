import { USER_ID } from '../api/todos';
import { Setters } from '../types/Setters';
import { Filter } from '../types/Filter';
import { TodoWithLoader } from '../types/TodoWithLoader';

export function filterTodos(todos: TodoWithLoader[], filter: Filter) {
  switch (filter) {
    case Filter.active:
      return todos.filter(todo => !todo.completed);
    case Filter.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export function completedTodos(todos: TodoWithLoader[]) {
  return todos.filter(todo => todo.completed);
}

export function uncompletedTodos(todos: TodoWithLoader[]) {
  return todos.filter(todo => !todo.completed);
}

export function updateTodoLoading(
  todo: TodoWithLoader,
  isLoading: boolean,
  setter: Setters,
) {
  setter.setTodos(prevTodos => {
    const index = prevTodos.findIndex(todo1 => todo1.id === todo.id);
    const oldTodo = prevTodos[index];

    if (index >= 0) {
      setter.setUpdatedAt(new Date());
      const newTodo: TodoWithLoader = { ...oldTodo, loading: isLoading };

      prevTodos.splice(index, 1, newTodo);
    }

    return prevTodos;
  });
}

export const createNewTodo = (
  newTitle: string,
  isCompleted: boolean,
): TodoWithLoader => {
  return {
    id: 0,
    userId: USER_ID,
    title: newTitle,
    completed: isCompleted,
    loading: false,
  };
};
