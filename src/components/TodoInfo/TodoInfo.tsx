import { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  removeTodo: (id:number) => void;
  onHandleStatusTodo: (id:number, completed:boolean) => void;
  onHandleTitleTodo: (id:number, title:string) => void;
  updatingTodo: Todo | null,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  onHandleStatusTodo,
  onHandleTitleTodo,
  updatingTodo,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditTitleMode, setEditTitleMode] = useState(false);

  const toggleStatusTodo = () => {
    onHandleStatusTodo(id, completed);
  };

  const handleVisibleForm = () => {
    setEditTitleMode(true);
  };

  const handleNewTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const saveNewTitle = (event: FormEvent) => {
    event.preventDefault();

    const normalizeTitle = newTitle.trim();

    if (normalizeTitle === title) {
      setEditTitleMode(false);

      return;
    }

    if (!normalizeTitle.length) {
      removeTodo(id);
    }

    onHandleTitleTodo(id, normalizeTitle);
    setEditTitleMode(false);
  };

  const cancelChangeTitle = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTitleMode(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={handleVisibleForm}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleStatusTodo}
        />
      </label>

      {isEditTitleMode ? (
        <form onSubmit={saveNewTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleNewTitle}
            onKeyUp={cancelChangeTitle}
            onBlur={saveNewTitle}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      )
        : (
          <>
            <span className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames('modal overlay',
          { 'is-active': isLoading || updatingTodo?.id === id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
