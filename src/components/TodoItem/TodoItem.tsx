import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { patchTodoStatus, patchTodoTitle } from '../../api/todos';

type Props = {
  todo: Todo;
  isActive?: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  loadingTodoIds?: boolean;
  showError?: (message: string) => void;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  onDelete,
  loadingTodoIds,
  showError,
  setTodos,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasDoubleClick, setHasDoubleClick] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [startTitle, setStartTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasDoubleClick && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasDoubleClick]);

  const handleClick = () => {
    const updated = { ...todo, completed: !todo.completed };

    setIsLoading(true);

    patchTodoStatus(updated)
      .then((data: Todo) => {
        if (setTodos) {
          setTodos((prev: Todo[]) => {
            return prev.map(item => {
              if (item.id === data.id) {
                return data;
              } else {
                return item;
              }
            });
          });
        }
      })
      .catch(() => {
        if (showError) {
          showError('Unable to update a todo');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const changeTitle = () => {
    const trimmed = title.trim();
    const updatedTodo = { ...todo, title: trimmed };

    setIsLoading(true);

    patchTodoTitle(updatedTodo)
      .then(data => {
        if (setTodos) {
          setTodos((prev: Todo[]) => {
            return prev.map(item => {
              if (item.id === data.id) {
                return data;
              } else {
                return item;
              }
            });
          });
        }

        setTitle(trimmed);
        setHasDoubleClick(false);
      })
      .catch(() => {
        if (showError) {
          showError('Unable to update a todo');
          inputRef.current?.focus();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = title.trim();

    if (trimmed === todo.title) {
      setHasDoubleClick(false);
      setTitle(trimmed);

      return;
    }

    if (trimmed === '') {
      setIsLoading(true);
      if (onDelete) {
        onDelete(todo.id).finally(() => setIsLoading(false));
      }

      return;
    }

    changeTitle();
  };

  const handleTitleBlur = () => {
    const trimmed = title.trim();

    if (trimmed === '') {
      setIsLoading(true);
      if (onDelete) {
        onDelete(todo.id).finally(() => setIsLoading(false));
      }

      return;
    }

    if (trimmed !== todo.title) {
      changeTitle();
    } else {
      setTitle(startTitle);
      setHasDoubleClick(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo as done"
          checked={todo.completed}
          onChange={handleClick}
        />
      </label>

      {!hasDoubleClick ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setHasDoubleClick(true);
            setStartTitle(title);

            window.getSelection()?.removeAllRanges();
          }}
        >
          {title}
        </span>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setTitle(startTitle);
                setHasDoubleClick(false);
              }
            }}
            onBlur={handleTitleBlur}
          />
        </form>
      )}

      {/* Remove button appears only on hover */}
      {!hasDoubleClick && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            if (onDelete) {
              setIsLoading(true);
              onDelete(todo.id).finally(() => setIsLoading(false));
            }
          }}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isActive ? 'is-active' : ''} ${isLoading ? 'is-active' : ''} ${loadingTodoIds ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
