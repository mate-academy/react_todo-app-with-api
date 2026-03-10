/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FormEvent, useEffect, useRef, useState, useCallback } from 'react';
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processings: number[];
  updateLoad: boolean;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, title?: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processings,
  updateLoad,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const [editingTitle, setEditingTitle] = useState('');
  const [editingId, setEditingId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [editingId]);

  async function handleSubmit(event: FormEvent, todo: Todo) {
    event.preventDefault();
    const title = editingTitle.trim();

    if (title === todo.title) {
      setEditingId(0);

      return;
    }

    try {
      if (title === '') {
        await onDeleteTodo(todo.id);
      } else {
        await onUpdateTodo(todo.id, title);
      }

      setEditingId(0); // ✅ тільки при успіху
    } catch {
      // форма залишається відкритою
    }
  }

  async function finishEdit(todo: Todo) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const title = editingTitle.trim();

    if (title === todo.title) {
      setEditingId(0);
      setIsSubmitting(false);

      return;
    }

    try {
      if (title === '') {
        await onDeleteTodo(todo.id);
      } else {
        await onUpdateTodo(todo.id, title);
      }

      setEditingId(0);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDocumentKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingId(0);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', handleDocumentKeyUp);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('keyup', handleDocumentKeyUp);
    };
  }, [handleDocumentKeyUp]); // Depend on the memoized handler

  return (
    <section
      className={cn('todoapp__main', {
        hidden: todos?.length === 0 && !tempTodo,
      })}
      data-cy="TodoList"
    >
      {todos?.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => onUpdateTodo(todo.id)}
              disabled={updateLoad}
            />
          </label>

          {editingId === todo.id ? (
            <form onSubmit={event => handleSubmit(event, todo)}>
              <input
                data-cy="TodoTitleField"
                className="todo__title"
                defaultValue={todo.title}
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                ref={inputRef}
                onBlur={() => setTimeout(() => finishEdit(todo), 0)}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setEditingTitle(todo.title);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDeleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': processings.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo" key={0}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
