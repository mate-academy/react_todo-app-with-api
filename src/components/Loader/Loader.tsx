import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo?: Todo,
  activeLoader?: number[],
  tempTodo?: Todo | null,
};

export const Loader: React.FC<Props> = ({ todo, activeLoader, tempTodo }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={
        classNames(
          'modal',
          'overlay',
          {
            'is-active': activeLoader?.find(id => id === todo?.id) || tempTodo,
          },
        )
      }
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
