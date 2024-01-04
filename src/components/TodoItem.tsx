import {
  ChangeEvent,
  FC,
  FormEvent,
  useRef,
  useState,
  KeyboardEvent,
  FocusEvent,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo
  inProcess: boolean
  onDelete?: (id: number) => void
  onChange?: (newTodo: Todo) => Promise<void>
};

export const TodoItem: FC<Props> = ({
  todo, inProcess, onDelete, onChange,
}) => {
  const { id, title, completed } = todo;

  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
    | FocusEvent<HTMLInputElement, Element>,
  ) => {
    e.preventDefault();

    if (inputValue.trim() === title) {
      setIsEditMode(false);

      return;
    }

    if (!inputValue.trim()) {
      onDelete?.(id);

      return;
    }

    onChange?.({ ...todo, title: inputValue.trim() })
      .finally(() => setIsEditMode(false));
  };

  const handleStartEditing = () => {
    setIsEditMode(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditMode(false);
      setInputValue(title);
    }
  };

  const handleToggleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...todo, completed: e.target.checked });
  };

  useEffect(() => {
    if (isEditMode) {
      inputRef.current?.focus();
    }
  }, [isEditMode]);

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
          checked={completed}
          onChange={handleToggleCheckbox}
        />
      </label>

      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': inProcess,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
