/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useContext } from 'react';
import { StateContext } from './StateContext';

export const TemporaryTodo = () => {
  const { temporaryIds, tempTodo } = useContext(StateContext);

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo?.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            tempTodo?.id !== undefined && temporaryIds.includes(tempTodo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
