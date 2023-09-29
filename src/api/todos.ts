import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export abstract class TodoService {
  static getTodos = (userId: number) => {
    return client.get<Todo[]>(`/todos?userId=${userId}`);
  };

  static addTodo = (todo: Omit<Todo, 'id'>) => {
    return client.post<Todo>('/todos', todo);
  };

  static editTodo = (todo: Partial<Todo> & { id: number }) => {
    const { id, ...rest } = todo;

    return client.patch<Todo>(`/todos/${id}`, rest);
  };

  static deleteTodo = (id: number) => {
    return client.delete(`/todos/${id}`);
  };
}

// Add more methods here
