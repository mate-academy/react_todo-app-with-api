import cn from 'classnames';
import React from 'react';

interface Props {
  toggleTodos: () => Promise<void>;
  hasActiveTodos: boolean;
  isTodoInProgressNotEmpty: boolean;
}

export const ToggleAllButton: React.FC<Props> = ({
  toggleTodos,
  hasActiveTodos,
  isTodoInProgressNotEmpty,
}) => {
  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: !hasActiveTodos && !isTodoInProgressNotEmpty,
      })}
      data-cy="ToggleAllButton"
      onClick={toggleTodos}
    />
  );
};

{
  /* this button should have `active` class only if all todos are completed */
}
