/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  processings: number[];
  onUpdate: (updatedTodo: Todo) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  onUpdate,
  todos,
  onDelete,
  tempTodo,
  processings,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const inputFocus = useRef<HTMLInputElement | null>(null);
  const isSubmitting = useRef(false);

  useEffect(() => {
    inputFocus.current?.focus();
  }, [editingId]);

  const onSubmit = (e: React.FormEvent, updatedTodo: Todo) => {
    e.preventDefault();

    if (isSubmitting.current) {
      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === updatedTodo.title) {
      setEditingId(null);

      return;
    }

    isSubmitting.current = true;

    if (editingId) {
      if (trimmedTitle === '') {
        onDelete(editingId)
          .then(() => {
            setEditingId(null);
            setEditingTitle('');
          })
          .catch(() => {
            setEditingId(updatedTodo.id);
            setEditingTitle(updatedTodo.title);
          })
          .finally(() => (isSubmitting.current = false));

        return;
      }
    }

    onUpdate({ ...updatedTodo, title: trimmedTitle })
      .then(() => {
        setEditingId(null);
        setEditingTitle('');
      })
      .catch(() => {
        setEditingId(updatedTodo.id);
        setEditingTitle(trimmedTitle);
      })
      .finally(() => (isSubmitting.current = false));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onClick={() => {
                const updatedTodo = { ...todo, completed: !todo.completed };

                onUpdate(updatedTodo);
              }}
            />
          </label>

          {editingId === todo.id ? (
            <form onSubmit={e => onSubmit(e, todo)}>
              <input
                type="text"
                className="todo__title"
                data-cy="TodoTitleField"
                ref={inputFocus}
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onKeyUp={e => {
                  if (e.key === 'Escape') {
                    setEditingId(null);
                  }
                }}
                onBlur={e => {
                  onSubmit(e, todo);
                }}
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
                onClick={() => {
                  onDelete(todo.id);
                }}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': processings.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo is-temp" key={'temp'}>
          <label className="todo__status-label" htmlFor="todo-temp">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              id="todo-temp"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
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
