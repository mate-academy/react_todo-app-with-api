import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (target: Todo) => {
  return client.patch(
    `/todos/${target.id}`,
    {
      completed: target.completed,
      title: target.title,
    },
  );
};
