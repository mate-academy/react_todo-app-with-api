/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TempTodo: React.FC<Props> = ({ todo }) => (
  <div className="todo" data-cy="Todo">
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        data-cy="TodoStatus"
        checked={todo.completed}
        readOnly
      />
    </label>

    <span className="todo__title" data-cy="TodoTitle">
      {todo.title}
    </span>

    <div className="modal overlay is-active" data-cy="TodoLoader">
      <div
        className={classNames('modal-background', 'has-background-white-ter')}
      />
      <div className="loader" />
    </div>
  </div>
);
