import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onRemove: (userId: number) => void;
  todosTransform: number[];
  updateTodo: (todoId: number, completed: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  todosTransform,
  updateTodo,
}) => {
  const { completed, title, id } = todo;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [query, setQuery] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuery(title);
        setIsFormOpen(false);
      }
    };

    document.addEventListener('keyup', handleEscape);
  
  }, [isFormOpen]);

  const handleTitleChange = () => {
    const trimmQuery = query.trim();

    if (!trimmQuery) {
      onRemove(id);
    }

    if (trimmQuery === title) {
      setIsFormOpen(false);
    }

    if (trimmQuery !== title && trimmQuery.length) {
      updateTodo(id, { title: query });
    }

    setIsFormOpen(false);
  };

  const handleBlur = () => {
    handleTitleChange();
  };

  const handlerRemove = () => onRemove(id);
  const handleUpdateStatus = () => updateTodo(id, { completed: !completed })
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => setIsFormOpen(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleUpdateStatus}
        />
      </label>

      {isFormOpen
        ? (
          <form onSubmit={handleTitleChange}>
            <label>
              <input
                type="text"
                className="todo__title-field"
                ref={inputRef}
                value={query}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </label>
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={handlerRemove}
              >
                ×
              </button>
          </>
        )
      }

      

      <div className={classNames(
        'modal overlay',
        {
          'is-active': todosTransform.includes(id)
        },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
