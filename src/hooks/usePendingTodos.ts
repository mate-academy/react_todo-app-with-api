import { useState } from 'react';
import { Todo } from '../types/Todo';

export const usePendingTodos = () => {
  const [pendingTodoIds, setPendingTodoIds] = useState<Todo['id'][]>([]);

  const addPendingTodo = (id: Todo['id']) => {
    setPendingTodoIds(current =>
      current.includes(id) ? current : [...current, id],
    );
  };

  const removePendingTodo = (id: Todo['id']) => {
    setPendingTodoIds(current => current.filter(todoId => todoId !== id));
  };

  return { pendingTodoIds, addPendingTodo, removePendingTodo };
};
