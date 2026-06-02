import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4242;

export const todosService = {
  list: () => client.get<Todo[]>(`/todos?userId=${USER_ID}`),
  add: (title: string) =>
    client.post<Todo>(`/todos`, {
      userId: USER_ID,
      title,
      completed: false,
    }),
  delete: (todoId: number) => client.delete(`/todos/${todoId}`),
  update: (todoId: number, data: Partial<Todo>) =>
    client.patch<Todo>(`/todos/${todoId}`, data),
};

export enum TodosServiceError {
  UnableToLoadTodos = 'todos_service_unable_to_load_todos',
  TitleShouldNotBeEmpty = 'todos_service_title_should_not_be_empty',
  UnableToAddTodo = 'todos_service_unable_to_add_todo',
  UnableToDeleteTodo = 'todos_service_unable_to_delete_todo',
  UnableToUpdateTodo = 'todos_service_unable_to_update_todo',
}

export const TODOS_ERROR_MESSAGE: Record<TodosServiceError, string> = {
  [TodosServiceError.UnableToLoadTodos]: 'Unable to load todos',
  [TodosServiceError.TitleShouldNotBeEmpty]: 'Title should not be empty',
  [TodosServiceError.UnableToAddTodo]: 'Unable to add a todo',
  [TodosServiceError.UnableToDeleteTodo]: 'Unable to delete a todo',
  [TodosServiceError.UnableToUpdateTodo]: 'Unable to update a todo',
};

export function getTodoError(errorKey: TodosServiceError): string {
  return TODOS_ERROR_MESSAGE[errorKey];
}
