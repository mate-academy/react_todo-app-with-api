import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => client.get<Todo[]>(`/todos?userId=${userId}`);

export const addTodo = (todo: Todo) => client.post<Todo>('/todos', todo);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

export const updateTodos = (data: Partial<Todo>) => client.patch<Partial<Todo>>(`/todos/${data.id}`, data);
