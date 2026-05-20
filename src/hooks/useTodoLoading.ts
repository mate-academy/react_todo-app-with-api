import React from 'react';

export const useTodoLoading = () => {
  const [loadingTodoIds, setLoadingTodoIds] = React.useState<number[]>([]);

  const addLoadingTodo = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);
  };

  const removeLoadingTodo = (todoId: number) => {
    setLoadingTodoIds(current => current.filter(id => id !== todoId));
  };

  return {
    loadingTodoIds,
    addLoadingTodo,
    removeLoadingTodo,
  };
};
