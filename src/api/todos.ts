import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { ErrorMessage } from '../types/ErrorMessage';

export const USER_ID = 2520;

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

    return response;
  } catch (error) {
    throw new Error(ErrorMessage.LOAD);
  }
};

export const addTodo = async (title: string): Promise<Todo> => {
  try {
    const response = await client.post<Todo>('/todos', {
      userId: USER_ID,
      title,
      completed: false,
    });

    return response;
  } catch (error) {
    throw new Error(ErrorMessage.ADD);
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await client.delete(`/todos/${id}`);
  } catch (error) {
    throw new Error(ErrorMessage.DELETE);
  }
};

export const updateTodo = async (
  id: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  try {
    return await client.patch<Todo>(`/todos/${id}`, data);
  } catch (error) {
    throw new Error(ErrorMessage.UPDATE);
  }
};
