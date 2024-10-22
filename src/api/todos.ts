import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTitle: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    userId: USER_ID,
    title: newTitle,
    completed: false,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoTitle = (todoId: number, newTitle: string) => {
  return client.patch(`/todos/${todoId}`, { title: newTitle });
};

export const updateTodoCompleted = (todoId: number, isCompleted: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: isCompleted });
};
