/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef } from 'react';
import { Todo, TodoTitleOrCompleted } from '../types/Todo';

type Props = {
  todo: Todo;
  editCheckbox?: (data: TodoTitleOrCompleted, id: number) => void;
  deleteTodo?: (todo: Todo) => void;
  onDubleClick?: (todo: Todo) => void;
  onTitle?: (title: string, todo: Todo) => void;
  onEsc?: () => void;
  isCompleted?: boolean;
  isOpenForm?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editCheckbox = () => {},
  deleteTodo = () => {},
  onDubleClick = () => {},
  onTitle = () => {},
  onEsc = () => {},
  isCompleted,
  isOpenForm,
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleDubleClick = () => {
    onDubleClick(todo);

    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  }

  const editTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const newTitle = form.get('newTitle') as string;

    onTitle(newTitle, todo);
  }

  const handleTitleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();

    onTitle(newTitle, todo);
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEsc();
    }
  }

  return (
    <>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={e => editCheckbox({ completed: e.target.checked }, todo.id)}
        />
      </label>

      {isOpenForm ? (
        <form onSubmit={e => editTitle(e)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            name="newTitle"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            onBlur={handleTitleBlur}
            onKeyUp={handleKeyUp}
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}
    </>
  );
};
