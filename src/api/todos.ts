import { Todo, TodoData } from '../types';
import { client } from '../utils';

export const USER_ID = 5554;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoById = (
  todoId: number,
  fieldsToUpdate: TodoData,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, fieldsToUpdate);
};

export const addTodoWithTitle = (title: string) => {
  const todo = {
    userId: USER_ID,
    completed: false,
    title,
  };

  return addTodo(todo);
};
