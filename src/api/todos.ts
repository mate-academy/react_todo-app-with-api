import { ErrorType } from '../types/ErrorType';
import { Filter } from '../types/Filter';
import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = (
  todoId: number,
  status: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { completed: status });
};

export const updateTodoTitle = (
  todoId: number,
  title: string,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { title });
};

export function generateErrorMessage(errorType: ErrorType) {
  switch (errorType) {
    case ErrorType.LOAD:
      return 'Unable to load todos: server is unavailable';
    case ErrorType.EMPTY_TITLE:
      return 'Title can\'t be empty';
    case ErrorType.DELETE:
      return 'Unable to add a todo';
    case ErrorType.ADD:
      return 'Unable to add a todo';
    case ErrorType.UPDATE:
      return 'Unable to update a todo';
    default:
      return '';
  }
}

export function prepareTodo(todos: Todo[], status: Filter):Todo[] {
  return todos.filter(todo => {
    switch (status) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
}

export function closeErrorNotification(
  errorSetter: (hasError: boolean) => void,
) {
  let timerId;

  window.clearTimeout(timerId);

  timerId = window.setTimeout(() => {
    errorSetter(false);
  }, 3000);
}
