/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoid: number) => Promise<void>;
  handleToggleCompleleTodo: (todo: Pick<Todo, 'id' | 'completed'>) => void;
  isProssesing: boolean;
  titleInput: string;
  setTitleInput: (str: string) => void;
  editTodo: Todo | null;
  setEditTodo: (todo: Todo | null) => void;
  onEditSubmit: (todo: Todo) => void;
};

const TodoItemComponent: React.FC<Props> = ({
  todo,
  onDelete,
  isProssesing,
  handleToggleCompleleTodo,
  titleInput,
  setTitleInput,
  editTodo,
  setEditTodo,
  onEditSubmit,
}) => {
  const inputTitleRef = useRef<HTMLInputElement | null>(null);

  const isEditing = editTodo?.id === todo.id;

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEditSubmit(todo);
  };

  const handleEditOnBlur = () => {
    onEditSubmit(todo);
  };

  useEffect(() => {
    if (isEditing) {
      inputTitleRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleToggleCompleleTodo(todo)}
          checked={todo.completed}
        />
      </label>

      {isEditing && !isProssesing ? (
        <form
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setEditTodo(null);
              setTitleInput(todo.title);
            }
          }}
          onSubmit={handleEditSubmit}
        >
          <input
            ref={inputTitleRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleInput}
            onChange={event => setTitleInput(event.target.value)}
            onBlur={handleEditOnBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setTitleInput(todo.title);
              setEditTodo(todo);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => (!isProssesing ? onDelete(todo.id) : undefined)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProssesing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);
