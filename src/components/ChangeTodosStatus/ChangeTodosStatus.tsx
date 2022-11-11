import classNames from 'classnames';
import React from 'react';

type Props = {
  toggleAllTodos: () => void,
  isAllTodoCompleted: boolean
};

export const ChangeTodosStatus:React.FC<Props> = ({
  toggleAllTodos,
  isAllTodoCompleted,
}) => (
  // eslint-disable-next-line jsx-a11y/control-has-associated-label
  <button
    data-cy="ToggleAllButton"
    type="button"
    className={classNames('todoapp__toggle-all', {
      active: isAllTodoCompleted,
    })}
    onClick={toggleAllTodos}
  />
);
