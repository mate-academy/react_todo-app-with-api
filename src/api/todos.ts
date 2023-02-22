import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { ErrorMessages } from '../types/ErrorMessages';

export const USER_ID = 6350;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  const newTodo = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export async function removeTodo(id: number) {
  try {
    await client.delete(`/todos/${id}`);
  } catch (error) {
    throw Error(ErrorMessages.Delete);
  }
}

export async function updateTodo(todo: Todo) {
  try {
    await client.patch(`/todos/${todo.id}`, todo);
  } catch (error) {
    throw Error(ErrorMessages.Update);
  }
}
