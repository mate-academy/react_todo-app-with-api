import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2050;

export const getTodos = async (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = async (title: string): Promise<Todo> => {
  const newTodo: Omit<Todo, 'id'> = {
    title,
    completed: false,
    userId: USER_ID,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = async (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`) as Promise<void>;
};

export const updateTodoTitle = async (
  todoId: number,
  newTitle: string,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, { title: newTitle });
};

export const toggleTodoStatus = async (
  todoId: number,
  completed: boolean,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const toggleAllTodos = async (
  shouldCompleteAll: boolean,
  todos: Todo[],
) => {
  return Promise.all(
    todos
      .filter(todo => todo.completed !== shouldCompleteAll)
      .map(todo =>
        client.patch<Todo>(`/todos/${todo.id}`, {
          completed: shouldCompleteAll,
        }),
      ),
  );
};
