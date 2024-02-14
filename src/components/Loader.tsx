import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';

interface Props {
  items: Todo
}

export const Loader: React.FC<Props> = ({ items }) => {
  const { changedTodos } = useContext(TodoContext);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': changedTodos.includes(items),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
