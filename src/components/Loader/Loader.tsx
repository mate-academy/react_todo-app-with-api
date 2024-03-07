import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  activeLoader?: number[],
};

export const Loader: React.FC<Props> = ({ todo, activeLoader }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={
        classNames(
          'modal',
          'overlay',
          {
            'is-active': activeLoader?.find(id => id === todo?.id)
              || todo.id === 0,
          },
        )
      }
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
