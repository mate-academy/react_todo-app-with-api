import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export class TodoService {
  static getByUserId(userId: number): Promise<Todo[]> {
    return client.get<Todo[]>(`/todos?userId=${userId}`);
  }

  static async create(todoData: Omit<Todo, 'id'>): Promise<Todo> {
    return client.post<Todo>('/todos', todoData);
  }

  static async delete(todoId: number): Promise<void> {
    await client.delete(`/todos/${todoId}`);
  }

  static update(id: number, updatedTodo: Partial<Todo>): Promise<Todo> {
    return client.patch<Todo>(`/todos/${id}`, updatedTodo);
  }
}
