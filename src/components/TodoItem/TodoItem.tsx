import React, { KeyboardEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  handleDeleteTodo?: (id: number) => void,
  handleTogglingTodo?: (todoId: number, todoStatus: boolean) => void,
  isLoading?: boolean,
  updateTitle?: (todoId: number, title: string) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  handleDeleteTodo = () => { },
  isLoading = true,
  handleTogglingTodo = () => { },
  updateTitle = () => { },
}) => {
  const [isTodoOnEdit, setIsTodoOnEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);

  const handleTitleEditing = () => {
    switch (title) {
      case '':
        handleDeleteTodo(todo.id);
        break;
      case todo.title:
        break;
      default:
        updateTitle(todo.id, title);
    }

    setIsTodoOnEdit(false);
  };

  const handleCancelEditing = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsTodoOnEdit(false);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={(event) => {
            event.preventDefault();
            handleTogglingTodo(todo.id, !todo.completed);
          }}
        />
      </label>

      {isTodoOnEdit
        ? (
          <form
            onSubmit={handleTitleEditing}
            onBlur={handleTitleEditing}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              onKeyDown={handleCancelEditing}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                setIsTodoOnEdit(true);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={(event) => {
                event.preventDefault();
                handleDeleteTodo(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
