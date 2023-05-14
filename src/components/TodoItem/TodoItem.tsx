import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo, updateTodoOnServer } from '../../api/todos';
import { ErrorTypes } from '../../types/PossibleError';
import { ChangeTodo } from '../../types/ChangeTodo';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
  showError?: (possibleError: ErrorTypes) => void;
  hideError?: () => void;
  isLoading: boolean;
  changeTodo?: ChangeTodo,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  deleteTodo = () => {},
  showError = () => {},
  hideError = () => {},
  isLoading,
  changeTodo = () => {},
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const changeForm = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (changeForm.current && isEditing) {
      changeForm.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = async (onError?: () => void) => {
    hideError();
    setIsWaiting(true);

    try {
      await removeTodo(id);

      deleteTodo(id);
    } catch {
      showError(ErrorTypes.Delete);
      setIsWaiting(false);

      onError?.();
    }
  };

  const handleEditTodo: ChangeTodo = async (
    todoId,
    name,
    newValue,
    onError,
  ) => {
    hideError();
    setIsWaiting(true);

    try {
      await updateTodoOnServer(todoId, { [name]: newValue });

      changeTodo(todoId, name, newValue);
    } catch {
      showError(ErrorTypes.Update);

      onError?.();
    } finally {
      setIsWaiting(false);
    }
  };

  const handleEditStatus = () => {
    handleEditTodo(id, 'completed', !completed);
  };

  const handleEditTitle = () => {
    const newTitle = editTitle.trim();

    setIsEditing(false);
    setEditTitle(newTitle);
    if (newTitle === title) {
      return;
    }

    const onError = () => {
      setEditTitle(title);
    };

    if (!newTitle) {
      handleDeleteTodo(onError);

      return;
    }

    handleEditTodo(id, 'title', newTitle, onError);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleEditTitle();
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const resetTitleEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape') {
      return;
    }

    setIsEditing(false);
    setEditTitle(title);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    setIsEditing(true);
  };

  return (
    <div
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleEditStatus}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleTitle}
            onBlur={handleEditTitle}
            onKeyUp={resetTitleEdit}
            ref={changeForm}
          />
        </form>
      ) : (
        <>
          <span
            role="button"
            tabIndex={0}
            aria-label="Press Enter to edit title"
            className="todo__title"
            onKeyUp={handleKeyUp}
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo()}
            aria-label="Press Enter to delete todo"
          >
            {'\u00d7'}
          </button>
        </>
      )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isWaiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
