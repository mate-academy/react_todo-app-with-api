/* eslint-disable jsx-a11y/label-has-associated-control */

import { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodoCompleted: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  onUpdateTodoTitle: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoTask: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
  onUpdateTodoCompleted,
  onUpdateTodoTitle,
}) => {
  const [tempTodoTitle, setTempTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id, title, completed } = todo;

  const keyUpFunction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTempTodoTitle(title);
      setIsEditing(false);
    }
  };

  async function updateTitle() {
    const trimNewTitle = tempTodoTitle.trim();

    if (!trimNewTitle) {
      onDeleteTodo(id);
    }

    if (title !== trimNewTitle) {
      if (await onUpdateTodoTitle(id, tempTodoTitle)) {
        setTempTodoTitle(trimNewTitle);
        setIsEditing(false);
      } else {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else {
      setIsEditing(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateTitle();
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => onUpdateTodoCompleted(id, !completed)}
        />
      </label>

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className={classNames('todo__remove')}
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            autoFocus
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={tempTodoTitle}
            onChange={event => setTempTodoTitle(event.target.value)}
            onBlur={() => updateTitle()}
            onKeyUp={keyUpFunction}
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
