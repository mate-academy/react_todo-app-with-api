import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  tempTitle: Todo;
}

export const TempTodo: React.FC<Props> = ({ tempTitle: { title } }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          id={`todo-status`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled
        />
        {/*accessible text*/}
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
