import { Todo } from '../types/Todo';
import { TodoPostData } from '../types/TodoPostData';
import { client } from '../utils/fetchClient';

export const USER_ID = 10308;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);
export const postTodo = (data: TodoPostData) => client.post<Todo>(`/todos?userId=${USER_ID}`, data);
export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
export const changeTodo = (todoId: number, data: TodoPostData) => client.patch<Todo>(`/todos/${todoId}`, data);
