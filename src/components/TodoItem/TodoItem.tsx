import cn from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  id: number;
  title: string;
  isCompleted: boolean;
  removeTodoFromServer: (todoToRemoveId: number) => void;
  toggleCompletedStatus: (todoId: number, status: boolean) => Promise<void>;
  changeTodoTitle: (todoId: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = React.memo(({
  id,
  title,
  isCompleted,
  removeTodoFromServer,
  toggleCompletedStatus,
  changeTodoTitle,
}) => {
  const handleStatusToggle = useCallback(() => {
    toggleCompletedStatus(id, !isCompleted);
  }, [isCompleted]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const titleInput = useRef<HTMLInputElement>(null);

  const handleRemove = useCallback(() => {
    removeTodoFromServer(id);
  }, []);

  const handleChangeTodoTitle = useCallback(() => {
    setNewTitle(() => newTitle.trim());

    setIsFormVisible(false);

    if (title === newTitle) {
      return;
    }

    if (newTitle === '') {
      handleRemove();

      return;
    }

    changeTodoTitle(id, newTitle);
  }, [newTitle, title]);

  const handleFormSubmit = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    handleChangeTodoTitle();
  }, [handleChangeTodoTitle]);

  const handleInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(event.target.value);
  }, []);

  const handleInputCancel = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    handleChangeTodoTitle();
  }, [handleChangeTodoTitle]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [isFormVisible]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleStatusToggle}
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
              onKeyDown={handleInputCancel}
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

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
});
