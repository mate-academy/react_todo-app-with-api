import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteItem: (todoId: number) => void;
  toggleStatus: (todoId: number, todo: Todo) => void;
  isToggling: boolean;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    deleteItem,
    toggleStatus,
    isToggling,
  } = props;

  return (
    <div
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
      data-cy="TodoItem"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          onClick={() => toggleStatus(todo.id, todo)}
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">{todo.title}</span>
      <button
        className="todo__remove"
        data-cy="TodoDeleteButton"
        type="button"
        onClick={() => deleteItem(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isToggling,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
