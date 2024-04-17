/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onSave: (todoId: number, newTitle: string) => void;
  toggleTodoCompletion: (todoId: number) => void;
  loading: boolean;
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const NewTodo: React.FC<Props> = ({
  todo,
  toggleTodoCompletion,
  onSave,
  loading,
  handleKeyUp,
}) => {
  const { title, id, completed } = todo;
  const [editing, setEditing] = useState(false);

  const doubleClick = () => {
    setEditing(true);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
        onDoubleClick={doubleClick}
      >
        {editing ? (
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => onSave}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        ) : (
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => toggleTodoCompletion(id)}
            />
          </label>
        )}

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        {/* Remove button appears only on hover */}
        {/* <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteSingleTodo(id)}
        >
          ×
        </button> */}

        {/* overlay will cover the todo while it is being deleted or updated */}
        {loading && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </section>
  );
};
