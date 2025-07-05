import classNames from 'classnames';
import React from 'react';

type Props = {
  allCompleted: boolean;
  onToggleAll: () => void;
};

export const Button: React.FC<Props> = ({ allCompleted, onToggleAll }) => {
  {
    /* this button should have `active` class only if all todos are completed */
  }

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', { active: allCompleted })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
    />
  );
};
