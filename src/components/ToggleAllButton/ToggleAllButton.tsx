import classNames from 'classnames';
import React from 'react';

type Props = {
  handleToggleAllTodos: () => void;
  counterActiveTodos: number;
};

export const ToggleAllButton: React.FC<Props> = React.memo(({
  handleToggleAllTodos,
  counterActiveTodos,
}) => (
  <button
    data-cy="ToggleAllButton"
    type="button"
    className={classNames(
      'todoapp__toggle-all',
      { active: counterActiveTodos === 0 },
    )}
    aria-label="Toggle Button"
    onClick={() => handleToggleAllTodos()}
  />
));
