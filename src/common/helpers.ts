import { TodoWithMode } from '../types/TodoWithMode';
import { TodoCompletionType } from '../types/TodoCompletionType';

export const filterTodos = (
  todos: TodoWithMode[],
  todoCompletionFilterOption: TodoCompletionType,
): TodoWithMode[] => (
  todos
    .filter(todo => {
      switch (todoCompletionFilterOption) {
        case TodoCompletionType.Completed:
          return todo.completed;
        case TodoCompletionType.Active:
          return !todo.completed;
        default:
          return true;
      }
    })
);

export const getActiveTodosCount = (todos: TodoWithMode[]): number => (
  todos.filter(todo => todo.completed === false).length
);
