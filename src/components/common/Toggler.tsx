import React from 'react';
import classNames from 'classnames';

type Props = {
  hasActiveTodos: boolean;
  toggleAllTodos: () => void;
};

export const Toggler: React.FC<Props> = ({
  hasActiveTodos,
  toggleAllTodos,
}) => {
  return (
    <button
      type="button"
      className={
        classNames('todoapp__toggle-all', {
          active: hasActiveTodos,
        })
      }
      aria-label="toggle all todos status"
      onClick={toggleAllTodos}
    />
  );
};
