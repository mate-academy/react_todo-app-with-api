import { ClientTodo } from '../../types';
import { Action } from './types';

export const todosContextReducer = (
  todos: ClientTodo[],
  action: Action,
): ClientTodo[] => {
  const { payload, type } = action;

  switch (type) {
    case 'set':
      return payload.map(payloadTodo => ({ ...payloadTodo, loading: false }));
    case 'add':
      return [...todos, { ...payload, loading: false }];
    case 'delete':
      return todos.filter(todo => todo.id !== payload);
    case 'update':
      const { id, loading, completed, title, userId } = payload;
      const currentTodo = todos.find(todo => todo.id === id);

      if (currentTodo) {
        currentTodo.loading = loading;
        currentTodo.completed = completed;
        currentTodo.title = title;
        currentTodo.userId = userId;
      }

      return [...todos];
    default:
      return todos;
  }
};
