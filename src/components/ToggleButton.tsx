/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React from 'react';

type Props = {
  areAllActiveTodos: boolean;
  onClick: () => void;
};

export const ToggleButton: React.FC<Props> = ({
  areAllActiveTodos,
  onClick,
}) => (
  <button
    type="button"
    className={classNames(
      'todoapp__toggle-all',
      { active: !areAllActiveTodos },
    )}
    data-cy="ToggleAllButton"
    onClick={onClick}
  />
);
