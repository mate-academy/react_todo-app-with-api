import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 163;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoComplete = (todoId: number, completed: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: !completed });
};

export const updateTodoTitle = (todoId: number, newTitle: string) => {
  return client.patch(`/todos/${todoId}`, { title: newTitle });
};

export const toggleAllTodos = (todos: Todo[]) => {
  const promises = todos.map(todo => {
    return client.patch(`/todos/${todo.id}`, { completed: !todo.completed });
  });

  return Promise.all(promises);
};
