/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/types';
import { useState } from 'react';

type Props = {
  todo: Todo;
  deleteTodo: (value: number) => void;
  deletingId: number | null;
  updateTodo: (todo: Todo) => void;
  updatingId: number | null;
  inputRef: React.RefObject<HTMLInputElement>;
  updatingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingId,
  updateTodo,
  updatingId,
  inputRef,
  updatingIds,
}) => {
  const { completed, id, title } = todo;
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const handleTitleUpdate = () => {
    if (title === updatedTitle) {
      return setIsUpdating(false);
    }

    if (!updatedTitle) {
      return deleteTodo(todo.id);
    }

    if (title !== updatedTitle) {
      const updatedTodo = { ...todo, title: updatedTitle.trim() };

      updateTodo(updatedTodo);
      setIsUpdating(false);
    }
  };

  const handleCompleteTodo = () => {
    if (completed) {
      const updatedStatusTodo = { ...todo, completed: false };

      updateTodo(updatedStatusTodo);
    }

    if (!completed) {
      const updatedStatusTodo = { ...todo, completed: true };

      updateTodo(updatedStatusTodo);
    }
  };

  const cancel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsUpdating(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handleCompleteTodo}
        />
      </label>

      {isUpdating ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleTitleUpdate();
          }}
          onBlur={e => {
            e.preventDefault();
            handleTitleUpdate();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={e => setUpdatedTitle(e.target.value)}
            autoFocus
            onKeyUp={e => cancel(e)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsUpdating(true)}
          onClick={handleTitleUpdate}
        >
          {title}
        </span>
      )}

      {!isUpdating && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            deletingId === id || updatingId === id || updatingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
