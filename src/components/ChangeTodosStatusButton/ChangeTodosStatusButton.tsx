import cn from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  onUpdateTodoStatus: (todoId: number, status: boolean) => Promise<void>;
};

export const ChangeTodosStatusButton: React.FC<Props> = React.memo(({
  todos,
  loadTodos,
  onUpdateTodoStatus,
}) => {
  const isAllCompleted = useMemo(() => (
    todos.every(({ completed }) => completed)), [todos]);

  const changeAllTodosStatus = async () => {
    if (!isAllCompleted) {
      await Promise.all(todos.map(async ({ id, completed }) => {
        if (!completed) {
          return onUpdateTodoStatus(id, !completed);
        }

        return null;
      }));
    } else {
      await Promise.all(todos.map(async ({ id, completed }) => {
        return onUpdateTodoStatus(id, !completed);
      }));
    }
  };

  const handleChangingAllTodosStatus = async () => {
    await changeAllTodosStatus();
    await loadTodos();
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
