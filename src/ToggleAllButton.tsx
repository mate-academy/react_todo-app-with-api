import classNames from 'classnames';
import React from 'react';

type Props = {
  isAllCompleted: boolean;
  todosCount: number;
  onToggleAll: () => Promise<void>;
};

export const ToggleAllButton: React.FC<Props> = ({
  isAllCompleted,
  todosCount,
  onToggleAll,
}) => {
  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', { active: isAllCompleted })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
      disabled={todosCount === 0}
      aria-label="Toggle all todos"
    />
  );
};
