import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1685;

// Функція для отримання списку todo
export const getTodos = async () => {
  try {
    return await client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  } catch (error) {
    throw new Error('Failed to fetch todos');
  }
};

// Функція для додавання нового todo
export const addTodo = async (data: Partial<Todo>) => {
  try {
    return await client.post<Todo>('/todos', data);
  } catch (error) {
    throw new Error('Failed to add a new todo');
  }
};

// Функція для видалення todo
export const deleteTodo = async (todoId: number) => {
  try {
    return await client.delete(`/todos/${todoId}`);
  } catch (error) {
    throw new Error('Failed to delete the todo');
  }
};

// Функція для оновлення (редагування) todo
export const updateTodo = async (todoId: number, data: Partial<Todo>) => {
  try {
    return await client.patch<Todo>(`/todos/${todoId}`, data);
  } catch (error) {
    throw new Error('Failed to update the todo');
  }
};
