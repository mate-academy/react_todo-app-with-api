import { useState } from 'react';
import { Todo } from '../types/Todo';

export const useProcessingTodos = () => {
  const [processingTodosId, setProcessingTodosId] = useState<Todo['id'][]>([]);

  const add = (todoId: Todo['id']) => {
    setProcessingTodosId(current => [...current, todoId]);
  };

  const remove = (todoId: Todo['id']) => {
    setProcessingTodosId(current => current.filter(id => id !== todoId));
  };

  return { processingTodosId, add, remove };
};
