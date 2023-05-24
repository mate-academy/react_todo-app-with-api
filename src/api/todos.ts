import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const sendNewTodo = async (title: string, userId: number) => {
  const newTodo = await client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    userId,
    completed: false,
  });

  return newTodo;
};

export const getTodosByStatus = (
  userId: number, status: boolean,
): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=${status}`);
};

export const deleteTodo = (todoId: number): Promise<unknown> => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodoStatus = (todo: Todo): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    completed: !todo.completed,
  });
};

export const editTodoTitle = (
  todoId: number, newTitle: string,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title: newTitle,
  });
};
