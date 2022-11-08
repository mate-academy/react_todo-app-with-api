import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadTodos: () => void;
};

export const ClearCompletedTodos: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  loadTodos,
}) => {
  const handleDeleteAllCompleted = useCallback(async () => {
    await Promise.all(todos.map(todo => {
      if (todo.completed) {
        return onDeleteTodo(todo.id);
      }

      return null;
    }));

    loadTodos();
  }, [todos]);

  return (
    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      style={{ width: '100px' }}
      onClick={handleDeleteAllCompleted}
    >
      Clear completed
    </button>
  );
});
