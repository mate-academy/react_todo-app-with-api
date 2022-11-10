import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  sendNewTodoTitleToServer: (
    todoId: number,
    newTitle: string
  ) => Promise<void>;
  toggleTodoServerStatus: (todoId: number, status: boolean) => Promise<void>;
  removeTodoFromServer: (id: number) => void;
}

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  removeTodoFromServer,
  toggleTodoServerStatus,
  sendNewTodoTitleToServer,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const titleInput = useRef<HTMLInputElement>(null);

  const handleRemove = useCallback(() => {
    removeTodoFromServer(id);
  }, []);

  const handleStatusToggle = useCallback(() => {
    toggleTodoServerStatus(id, !completed);
  }, [completed]);

  const changeTodoTitle = useCallback(() => {
    const trimedNewTitle = newTitle.trim();

    setIsFormVisible(false);

    if (title === trimedNewTitle) {
      return;
    }

    if (trimedNewTitle === '') {
      handleRemove();

      return;
    }

    setNewTitle(trimedNewTitle);
    sendNewTodoTitleToServer(id, trimedNewTitle);
  }, [newTitle, title]);

  const handleFormSubmit = useCallback((
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    changeTodoTitle();
  }, [changeTodoTitle]);

  const handleInputBlur = useCallback(() => {
    changeTodoTitle();
  }, [changeTodoTitle]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(e.target.value);
  }, []);

  const handleInputKeydown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Escape') {
      setIsFormVisible(false);
      setNewTitle(title);
    }
  }, [title]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [isFormVisible]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleStatusToggle}
          defaultChecked
        />
      </label>

      {isFormVisible
        ? (
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={titleInput}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleInputChange}
              onKeyDown={handleInputKeydown}
              onBlur={handleInputBlur}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsFormVisible(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleRemove}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
