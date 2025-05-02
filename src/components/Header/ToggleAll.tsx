import classNames from 'classnames';
import React from 'react';

type Props = {
  active: boolean;
  onToggleAll: () => void;
};

export const ToggleAll: React.FC<Props> = ({ active, onToggleAll }) => {
  const buttonClasses = classNames('todoapp__toggle-all', { active });

  return (
    <button
      type="button"
      className={buttonClasses}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
    />
  );
};
