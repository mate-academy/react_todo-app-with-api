import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3157;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function addTodo(title: string) {
  return client.post('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
}

export function editTodo(todo: Omit<Todo, 'userId'>) {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    title: todo.title,
    completed: todo.completed,
    userId: USER_ID,
  });
}
