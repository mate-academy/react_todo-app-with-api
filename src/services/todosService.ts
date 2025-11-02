import { Todo } from '../types/Todo';
import * as api from '../api/todos';
import { USER_ID } from '../api/todos';

export const todosService = {
  async loadTodos(): Promise<Todo[]> {
    return api.getTodos();
  },

  async addTodo(title: string): Promise<Todo> {
    const newTodo: Omit<Todo, 'id'> = {
      title,
      userId: USER_ID,
      completed: false,
    };

    return api.createTodo(newTodo);
  },

  async removeTodo(id: number): Promise<void> {
    await api.deleteTodo(id);
  },

  async toggleTodo(todo: Todo): Promise<Todo> {
    return api.toggleTodoCompleted(todo);
  },

  async updateTodo(todo: Todo): Promise<Todo> {
    return api.updateTodoTitle(todo);
  },
};
