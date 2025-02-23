/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  tempTodo?: Todo;
}

export const TodoItem: React.FC<Props> = ({ tempTodo }) => {
  return (
    <>
      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: tempTodo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            disabled={true}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
          {tempTodo && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
