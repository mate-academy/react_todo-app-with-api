import {
  FC,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { useLoadingTodosContext } from '../../contexts/useLoadingTodosContext';
import type { Todo } from '../../types/Todo';

type Props = {
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  todo: Todo;
};

export const TodoItem: FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const { loadingTodosIds } = useLoadingTodosContext();
  const isCurrentLoading = useMemo(
    () => loadingTodosIds.includes(id),
    [loadingTodosIds],
  );

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelEditing = () => {
    setIsEditFormOpen(false);
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    const handleEscapePressed = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelEditing();
      }
    };

    document.addEventListener('keydown', handleEscapePressed);

    return () => {
      document.removeEventListener('keydown', handleEscapePressed);
    };
  }, [isEditFormOpen]);

  const handleStatusChange = () => {
    onUpdate(id, {
      completed: !completed,
    });
  };

  const handleTitleChange = () => {
    const normalized = currentTitle
      .trim()
      .split(' ')
      .filter(Boolean)
      .join(' ');

    if (!normalized) {
      onDelete(id);
    }

    if (normalized !== title) {
      onUpdate(id, {
        title: normalized,
      });
    }

    handleCancelEditing();
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleTitleChange();
  };

  const handleInputBlur = () => {
    handleTitleChange();
    handleCancelEditing();
  };

  return (
    <div
      className={classNames(
        'todo',
        'flex gap-4',
        'h-12 px-2',
        'rounded-lg',
        'items-center',
        'border',
        'shadow-md',
        'relative',
        {
          'pr-2': isEditFormOpen,
          'border-primary completed': completed,
          'opacity-50': isCurrentLoading,
        },
      )}
      onDoubleClick={() => setIsEditFormOpen(true)}
    >
      <label className="flex items-center justify-center">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditFormOpen ? (
        <form className="flex-grow" onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="input input-sm rounded-xs
              focus:outline-offset-0 text-base w-full"
            placeholder="What is the new title?"
            ref={inputRef}
            value={currentTitle}
            onChange={(event) => setCurrentTitle(event.target.value)}
            onBlur={handleInputBlur}
          />
        </form>
      ) : (
        <div className="grow flex">
          <div className="grow relative">
            {isCurrentLoading && (
              <div
                className="w-full absolute top-1/2 left-1/2
                transform -translate-x-1/2 -translate-y-1/2
                flex justify-center items-center"
              >
                <div
                  className="
                  w-5 h-5 rounded-full animate-spin border-2
                  border-primary border-dashed"
                  style={
                    {
                      '--value': '70',
                      '--size': '1rem',
                      '--thickness': '.25rem',
                    } as React.CSSProperties
                  }
                />
              </div>
            )}

            <span
              className={classNames('grow', 'truncate', {
                'line-through': completed,
              })}
            >
              {title}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-square btn-xs btn-ghost"
            onClick={() => onDelete(id)}
          >
            <i className="fa-solid fa-xmark fa-xl" />
          </button>
        </div>
      )}
    </div>
  );
};
