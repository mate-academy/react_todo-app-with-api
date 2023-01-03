import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await client.post('/todos', todo);

  return newTodo;
};

export const removeTodo = async (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = async (
  todoId: number,
  field: string,
  value: string | boolean,
) => {
  const updatedTodo = await client.patch(`/todos/${todoId}`, { [field]: value });

  return updatedTodo;
};

export const getTodosByCompletion = (todos: Todo[], isDone: boolean) => {
  return todos.filter(todo => todo.completed === isDone);
};
