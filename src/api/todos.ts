import { Todo } from '../types/Todo';
// import { USER_ID } from '../utils/UserID';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  const todos = await client.get<Todo[]>(`/todos?userId=${userId}`);

  return todos;
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const add = await client.post<Todo>('/todos', todo);

  return add;
};

export const deleteTodo = async (todoID: string) => {
  const deletedTodo = await client.delete(todoID);

  return deletedTodo;
};

export const updateTodoID = async (todoID: number, completed: boolean) => {
  const updatedTodo = await client.patch(`/todos/${todoID}`, { completed });

  return updatedTodo;
};

export const updateTodoTitle = async (todoID: number, title: string) => {
  const updatedTodo = await client.patch(`/todos/${todoID}`, { title });

  return updatedTodo;
};
// Add more methods here
