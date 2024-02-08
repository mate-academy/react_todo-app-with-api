import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo
  deleteTodo: (id:number) => void
  renameTodo: (newTitle: string) => Promise<void>
  toggleLoad: { isLoading: boolean, id: number }
  toggleAllLoad: boolean
};

export const EditForm: React.FC <Props> = ({
  todo,
  deleteTodo,
  renameTodo = () => Promise.resolve,
  toggleLoad,
  toggleAllLoad,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const isLoadingActive = toggleLoad.isLoading && toggleLoad.id === todo.id;

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (title.trim() === todo.title) {
      setEditing(false);

      return;
    }

    if (title.trim() === '') {
      deleteTodo(todo.id);

      return;
    }

    try {
      await renameTodo(title.trim());

      setEditing(false);
    } catch (error) {
      setEditing(true);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {editing ? (
        <>
          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={handleSubmit}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setEditing(false);
                  setTitle(todo.title);
                }
              }}
              ref={inputRef}
            />
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay',
                {
                  'is-active': isLoadingActive,
                })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </form>
        </>
      ) : (
        <>
          <span
            onDoubleClick={() => {
              setEditing(true);
              setTitle(todo.title);
            }}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            onClick={() => {
              deleteTodo(todo.id);
            }}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'is-active': (isLoadingActive) || toggleAllLoad,
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
