import cn from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props{
  todo: Todo;
  isWaitingResponse?: boolean;
}

export const TodoInfo:React.FC<Props> = ({
  todo,
  isWaitingResponse = false,
}) => {
  const [isHovered, setHover] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [titleUpdateInput, setTitleUpdateInput] = useState(todo.title);
  const { updateTodos, removeTodos } = useContext(TodosContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isUpdating) {
      inputRef.current?.focus();
    }
  }, [isUpdating]);

  const handleDoubleClick = () => {
    setIsUpdating(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitleUpdateInput(value);
  };

  const updateStatus = () => {
    updateTodos([todo.id], { completed: !todo.completed });
  };

  const updateTitle = () => {
    const inputValue = titleUpdateInput.trim();

    if (inputValue && inputValue !== todo.title) {
      updateTodos([todo.id], {
        title: titleUpdateInput,
      });
    } else if (!inputValue) {
      removeTodos([todo.id]);
    }

    setIsUpdating(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitle();
  };

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={updateStatus}
        />
      </label>

      {isUpdating ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={titleUpdateInput}
            ref={inputRef}
            onChange={handleInputChange}
            onBlur={() => updateTitle()}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          {isHovered && (
            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                removeTodos([todo.id]);
              }}
            >
              ×
            </button>
          )}
        </>
      )}

      <div className={cn(
        'modal', ' overlay', { 'is-active': isWaitingResponse },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
