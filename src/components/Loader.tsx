import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  loadingTodosIds: number[];
  todo: Todo;
};

export const Loader: React.FC<Props> = ({ loadingTodosIds, todo }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('modal', 'overlay', {
      'is-active': loadingTodosIds.includes(todo.id),
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
