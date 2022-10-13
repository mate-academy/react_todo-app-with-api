import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  selectedId: number[];
};

export const TodoLoader: React.FC<Props> = ({
  todo,
  selectedId,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal overlay',
        { 'is-active': selectedId.includes(todo.id) },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
