import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  temporaryTodo?: Todo;
  onDeleteTodo: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleTodoStatus: (id: number) => void;
  updatingTodos: boolean;
  onUpdateTodoTitle: (id: number, newTitle: string) => void;
};

export const TodoItem = ({
  todo: { id, title, completed },
  temporaryTodo,
  onDeleteTodo,
  inputRef,
  onToggleTodoStatus,
  updatingTodos,
  onUpdateTodoTitle,
}: Props) => {
  const [todoStatus, setTodoStatus] = useState<TodoStatus>('idle');
  const [newTitle, setNewTitle] = useState('');
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = async () => {
    setTodoStatus('updating');

    try {
      await onDeleteTodo(id);
    } finally {
      setTodoStatus('idle');
      inputRef.current?.focus();
    }
  };

  const handleToggleStatus = async () => {
    setTodoStatus('updating');

    try {
      await onToggleTodoStatus(id);
    } finally {
      setTodoStatus('idle');
      inputRef.current?.focus();
    }
  };

  const handleEscapeUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoStatus('idle');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (todoStatus !== 'editing' || trimmedTitle === title) {
      setTodoStatus('idle');

      return;
    }

    setTodoStatus('updating');

    try {
      if (trimmedTitle === '') {
        await onDeleteTodo(id);
      } else {
        await onUpdateTodoTitle(id, trimmedTitle);
      }

      setTodoStatus('idle');
    } catch {
      setTodoStatus('editing');
      renameInputRef.current?.focus();
    }
  };

  const handleOnBlur = (event: React.FormEvent) => {
    setTimeout(() => {
      handleSubmit(event);
    }, 0);
  };

  useEffect(() => {
    if (todoStatus === 'editing' && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [todoStatus]);

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      {todoStatus === 'editing' ? (
        <>
          <label className="todo__status-label" htmlFor={`todo=${id}`}>
            <input
              ref={checkboxRef}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={handleToggleStatus}
            />
          </label>

          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              ref={renameInputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleOnBlur}
              onKeyUp={handleEscapeUp}
            />
          </form>
        </>
      ) : (
        <>
          <label className="todo__status-label" htmlFor={`todo-${id}`}>
            <input
              data-cy="TodoStatus"
              id={`todo-${id}`}
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={handleToggleStatus}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setTodoStatus('editing');
              setNewTitle(title);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            temporaryTodo || todoStatus === 'updating' || updatingTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
