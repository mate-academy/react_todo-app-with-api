import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadTodos: () => void;
  onChangeProcessingIds: (todoId: number) => void;
};

export const ClearCompletedTodos: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  loadTodos,
  onChangeProcessingIds,
}) => {
  const handleDeleteAllCompleted = useCallback(async () => {
    await Promise.all(todos.map(async (todo) => {
      if (todo.completed) {
        onChangeProcessingIds(todo.id);

        return onDeleteTodo(todo.id);
      }

      return null;
    }));

    await loadTodos();
    onChangeProcessingIds(0);
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
