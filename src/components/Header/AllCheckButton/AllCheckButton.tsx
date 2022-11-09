import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoUpdateContext } from '../../ContextProviders/TodoProvider';

type Props = {
  isActive: boolean,
};

export const AllCheckButton: React.FC<Props> = ({ isActive }) => {
  const { changeAllComplet } = useContext(TodoUpdateContext);

  return (
    <button
      aria-label="all-check"
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: isActive },
      )}
      onClick={() => changeAllComplet(isActive)}
    />
  );
};
