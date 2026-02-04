/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  onPatch: (id: number, data: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onPatch,
}) => {
  const [changeTitle, setChangeTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleToggleItem = (state: boolean) => {
    const updateTodo = { ...todo, completed: state };

    onPatch(todo.id, updateTodo);
  };

  const handleRenameItem = () => {
    const titleTrimmed = newTitle.trim();

    setNewTitle(titleTrimmed);

    const updateTodo = { ...todo, title: titleTrimmed };

    if (titleTrimmed === '') {
      onDelete(todo.id);
    } else if (titleTrimmed !== todo.title) {
      onPatch(todo.id, updateTodo).then(() => setChangeTitle(false));
    } else {
      setChangeTitle(false);
    }
  };

  return (
    <div
      onDoubleClick={() => setChangeTitle(true)}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => handleToggleItem(event.target.checked)}
          readOnly
        />
      </label>
      {changeTitle ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleRenameItem();
          }}
        >
          <input
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setChangeTitle(false);
                setNewTitle(todo.title);
              }
            }}
            onBlur={handleRenameItem}
            onChange={event => setNewTitle(event.target.value)}
            value={newTitle}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {newTitle}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
