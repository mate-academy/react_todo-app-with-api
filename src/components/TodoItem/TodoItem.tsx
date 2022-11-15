import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isAdding: boolean,
  loadingIds: number[],
  deleteTodoFromServer: (todoId: number) => void,
  patchTodoStatusOnServer: (todoId: number, status: boolean) => void,
  patchTodoTitleOnServer: (todoId: number, title: string) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  loadingIds,
  deleteTodoFromServer,
  patchTodoStatusOnServer,
  patchTodoTitleOnServer,
}) => {
  const { id, title, completed } = todo;

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const newTitleField = useRef<HTMLInputElement>(null);

  const isLoading = useMemo(() => (
    loadingIds.includes(id) || (isAdding && !todo.id)
  ), [loadingIds, isAdding]);

  const changeTitle = useCallback(() => {
    const trimmedTitle = newTitle.trim();

    if (title === trimmedTitle) {
      setIsDoubleClicked(false);
      setNewTitle(trimmedTitle);
    }

    if (!trimmedTitle) {
      return;
    }

    setIsDoubleClicked(false);
    patchTodoTitleOnServer(id, trimmedTitle);
  }, [newTitle, title]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      changeTitle();
    }, [changeTitle],
  );

  const handleBlur = useCallback(() => {
    changeTitle();
  }, [changeTitle]);

  const handleKeyboardEvent = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (newTitleField.current) {
      newTitleField.current.focus();
    }
  }, [isDoubleClicked]);

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
          ref={newTitleField}
          checked={completed}
          onChange={() => patchTodoStatusOnServer(id, !completed)}
        />
      </label>

      {isDoubleClicked
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTitleField}
              value={newTitle}
              onBlur={handleBlur}
              onKeyDown={handleKeyboardEvent}
              onChange={event => {
                setNewTitle(event.target.value);
              }}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsDoubleClicked(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodoFromServer(id)}
            >
              ×
            </button>
          </>
        )}

      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />

          <div className="loader" />
        </div>
      )}
    </div>
  );
};
