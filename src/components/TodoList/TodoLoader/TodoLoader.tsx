import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { useTodosProvider } from '../../../providers/TodosContext';

type TodoLoaderProps = {
  todo: Todo;
};

export const TodoLoader: React.FC<TodoLoaderProps> = ({ todo }) => {
  const { deletedTodosId, updatedTodosId } = useTodosProvider();

  const isActive = deletedTodosId.includes(todo.id)
  || updatedTodosId.includes(todo.id);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isActive,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
