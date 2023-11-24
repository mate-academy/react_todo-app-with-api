import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  isLoading: boolean,
  loadingTodos: Todo[] | null,
  todo: Todo,
};

export const Loader: React.FC<Props> = ({
  isLoading,
  loadingTodos,
  todo,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading
          && loadingTodos?.some(t => t.id === todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
