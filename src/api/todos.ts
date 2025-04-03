import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2512;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const delTodos = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const updateTodoStatus = ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodoTitle = ({ id, title }) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const updateAllTodos = (todos: Todo[], newStatus: boolean) => {
  return todos
    .filter(todo => todo.completed !== newStatus)
    .map(
      todo =>
        client
          .patch<Todo>(`/todos/${todo.id}`, { completed: newStatus })
          .then(() => ({ id: todo.id })), // Повертаємо ID у resolve
    );
};

// Add more methods here
