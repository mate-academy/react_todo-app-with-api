import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { removeTodo, updateTodo } from '../../api/todos';
import { EditTodo } from '../../types/EditTodo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodo?: (todoId: number) => void;
  editTodo?: EditTodo;
  showError?: (errorType: ErrorType) => void;
  hideError?: () => void;
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  deleteTodo = () => {},
  editTodo = () => {},
  showError = () => {},
  hideError = () => {},
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [editTitle, setIsEditTitle] = useState(title);
  const editForm = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editForm.current && isEditing) {
      editForm.current.focus();
    }
  }, [isEditing]);

  const handleRemoveTodo = async (onError?: () => void) => {
    hideError();
    setIsWaiting(true);

    try {
      await removeTodo(id);

      deleteTodo(id);
    } catch {
      showError(ErrorType.Delete);
      setIsWaiting(false);

      onError?.();
    }
  };

  const handleEditTodo: EditTodo = async (
    todoId,
    name,
    newValue,
    onError,
  ) => {
    hideError();
    setIsWaiting(true);

    try {
      await updateTodo(todoId, { [name]: newValue });

      editTodo(todoId, name, newValue);
    } catch {
      showError(ErrorType.Update);

      onError?.();
    } finally {
      setIsWaiting(false);
    }
  };

  const handleEditStatus = () => {
    handleEditTodo(id, 'completed', !completed);
  };

  const handleEditTitile = () => {
    const newTitle = editTitle.trim();

    setIsEditing(false);
    setIsEditTitle(newTitle);
    if (newTitle === title) {
      return;
    }

    const onError = () => {
      setIsEditTitle(title);
    };

    if (!newTitle) {
      handleRemoveTodo(onError);

      return;
    }

    handleEditTodo(id, 'title', newTitle, onError);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleEditTitile();
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditTitle(event.target.value);
  };

  const resetTitleEdit = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Escape') {
      return;
    }

    setIsEditing(false);
    setIsEditTitle(title);
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    setIsEditing(true);
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
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
            onBlur={handleEditTitile}
            onKeyUp={resetTitleEdit}
            ref={editForm}
          />
        </form>
      ) : (
        <>
          <span
            role="button"
            tabIndex={0}
            aria-label="Press Enter to edit the title"
            className="todo__title"
            onKeyUp={handleKeyUp}
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleRemoveTodo()}
            aria-label="Press Enter to delete the todo"
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
