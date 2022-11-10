import cn from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  onUpdateTodoStatus: (todoId: number, status: boolean) => Promise<void>;
  onChangeProcessingIds: (todoId: number) => void;
};

export const ChangeTodosStatusButton: React.FC<Props> = React.memo(({
  todos,
  loadTodos,
  onUpdateTodoStatus,
  onChangeProcessingIds,
}) => {
  const isAllCompleted = useMemo(() => (
    todos.every(({ completed }) => completed)), [todos]);

  const changeAllTodosStatus = async () => {
    if (!isAllCompleted) {
      await Promise.all(todos.map(async ({ id, completed }) => {
        if (!completed) {
          onChangeProcessingIds(id);

          return onUpdateTodoStatus(id, !completed);
        }

        return null;
      }));
    } else {
      await Promise.all(todos.map(async ({ id, completed }) => {
        onChangeProcessingIds(id);

        return onUpdateTodoStatus(id, !completed);
      }));
    }
  };

  const handleChangingAllTodosStatus = async () => {
    await changeAllTodosStatus();
    await loadTodos();
    onChangeProcessingIds(0);
  };

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      data-cy="ToggleAllButton"
      type="button"
      className={cn(
        'todoapp__toggle-all',
        { active: isAllCompleted },
      )}
      onClick={handleChangingAllTodosStatus}
    />
  );
});
