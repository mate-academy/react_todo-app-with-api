/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (newTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = props => {
  const { todo, isLoading, onDeleteTodo, onUpdateTodo } = props;

  const [isUpdate, setIsUpdate] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(todo.title);

  const updateRef = useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    if (todo.title === updateTitle) {
      setIsUpdate(false);

      return;
    }

    if (!updateTitle) {
      onDeleteTodo(todo.id);

      return;
    }

    const updatedTodo: Todo = {
      id: todo.id,
      completed: todo.completed,
      title: updateTitle.trim(),
      userId: USER_ID,
    };

    onUpdateTodo(updatedTodo).then(() => setIsUpdate(false));
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === 'Escape') {
      setUpdateTitle(todo.title);
      setIsUpdate(false);
    }
  };

  const handleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    onUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdate();
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.preventDefault();
    if (e.relatedTarget?.tagName === 'INPUT') {
      return;
    }

    handleUpdate();
  };

  useEffect(() => {
    if (updateRef.current) {
      updateRef.current.focus();
    }
  }, [isUpdate]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleComplete}
        />
      </label>

      {isUpdate ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updateTitle}
            onChange={e => setUpdateTitle(e.target.value)}
            ref={updateRef}
            onKeyUp={handleEscape}
            onBlur={onBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsUpdate(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
