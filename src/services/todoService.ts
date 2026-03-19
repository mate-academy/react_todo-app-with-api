import { Todo } from '../types/Todo';
import {
  getTodos as fetchTodos,
  postTodo,
  deleteTodo as apiDeleteTodo,
  patchTodo,
  changeTodoTitle,
  USER_ID,
} from '../api/todos';

export class TodoService {
  static async loadTodos(): Promise<Todo[]> {
    return fetchTodos();
  }

  static async addTodo(title: string): Promise<Todo> {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      throw new Error('EMPTY_TITLE');
    }

    return postTodo(trimmedTitle, USER_ID);
  }

  static async deleteTodo(id: number): Promise<void> {
    await apiDeleteTodo(id);
  }

  static async toggleTodo(id: number, completed: boolean): Promise<Todo> {
    return patchTodo(id, completed);
  }

  static async updateTodoTitle(
    id: number,
    newTitle: string,
  ): Promise<Todo | null> {
    const trimmedTitle = newTitle.trim();

    // Return null to signal deletion is needed
    if (trimmedTitle === '') {
      return null;
    }

    return changeTodoTitle(id, trimmedTitle);
  }

  static async deleteCompletedTodos(
    todos: Todo[],
  ): Promise<{ successfulIds: number[]; hasErrors: boolean }> {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => apiDeleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    const hasErrors = successfulIds.length < completedTodos.length;

    return { successfulIds, hasErrors };
  }

  static async toggleAllTodos(
    todos: Todo[],
    shouldComplete: boolean,
  ): Promise<{ updates: Map<number, boolean>; hasErrors: boolean }> {
    const todosToToggle = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    const updates = new Map<number, boolean>();
    let hasErrors = false;

    await Promise.all(
      todosToToggle.map(async todo => {
        try {
          const updated = await patchTodo(todo.id, shouldComplete);

          updates.set(todo.id, updated.completed);
        } catch {
          hasErrors = true;
        }
      }),
    );

    return { updates, hasErrors };
  }
}
