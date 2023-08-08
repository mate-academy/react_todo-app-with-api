/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

type Props = {
  activeTodos: number,
  onToggleAll: () => void,
};

export const ToggleAll: React.FC<Props> = ({
  activeTodos,
  onToggleAll,
}) => {
  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', { active: activeTodos })}
      onClick={onToggleAll}
    />
  );
};
