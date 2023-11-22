import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const prepareTodoData = (todo: Todo) => {
  const {
    id,
    title,
    completed,
    userId,
  } = todo;
  const trimmedTitle = title.trim();

  if (!id || !trimmedTitle || userId === undefined) {
    throw new Error('Invalid todo data');
  }

  return {
    id,
    title: trimmedTitle,
    completed,
    userId,
  };
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  const preparedTodoData = prepareTodoData(todo);

  return client.patch<Todo>(`/todos/${preparedTodoData.id}`, preparedTodoData);
};
