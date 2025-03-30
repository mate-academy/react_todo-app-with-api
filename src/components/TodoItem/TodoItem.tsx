/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number[]) => Promise<void>;
  deletedTodo: number[];
  adding?: boolean;
  errorMessage: string;
  updatedTodo: Todo[];
  onUpdate: (el: Todo[]) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  deletedTodo,
  adding = false,
  onUpdate,
  updatedTodo,
  errorMessage,
}) => {
  const { id, completed, title, userId } = todo;
  const [completedTodo, setCompletedTodo] = useState(completed);
  const [titleTodo, setTitleTodo] = useState(title);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    setCompletedTodo(completed);
  }, [completed]);

  const isActive =
    deletedTodo.includes(id) || adding || updatedTodo.find(el => el.id === id);

  const update = () => {
    if (title === titleTodo) {
      return;
    }

    if (titleTodo.length === 0) {
      setEditing(true);
      onDelete([id])
        .then(() => {
          setEditing(false);
        })
        .catch(() => {
          setEditing(true);
        })
        .finally(() => {
          setEditing(true);
        });

      return;
    }

    if (errorMessage.length !== 0) {
      return;
    }

    onUpdate([
      {
        completed: completedTodo,
        title: titleTodo.trim(),
        id,
        userId,
      },
    ])
      .then(() => {
        setEditing(false);
      })
      .catch(() => {
        setEditing(true);
      });
  };

  const undoChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditing(false);

      return;
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    update();
    setEditing(false);
  };

  const onBlur = () => {
    if (title !== titleTodo) {
      update();
    }

    setEditing(false);
  };

  const changeCompleted = () => {
    const newCompleted = !completedTodo;

    onUpdate([
      {
        completed: newCompleted,
        title: titleTodo.trim(),
        id,
        userId,
      },
    ])
      .then(() => {
        setCompletedTodo(newCompleted);
      })
      .catch(() => {
        setCompletedTodo(completedTodo);
      });
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [editing, titleTodo.length]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completedTodo })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          onChange={changeCompleted}
          className="todo__status"
          checked={completedTodo}
        />
      </label>

      {editing ? (
        <form onSubmit={onSubmit}>
          <input
            id="title"
            onKeyDown={undoChange}
            data-cy="TodoTitleField"
            type="text"
            ref={inputRef}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleTodo}
            onBlur={onBlur}
            onChange={e => setTitleTodo(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([id])}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
