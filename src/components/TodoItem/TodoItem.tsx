import React, { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../../api/todos';
import { useTodos } from '../../TodosContext';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  isSubmitting: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessed }) => {
  const { title, id, completed } = todo;
  const { handleDeleteTodo, handleUpdateTodo, handleToggleComplete } =
    useTodos();
  const [newTitle, setNewTitle] = useState('');
  const [isEditinigTitle, setIsEditinigTitle] = useState<boolean>(false);

  const inputElement = useRef<HTMLInputElement | null>(null);

  function handleMarkComplete() {
    handleToggleComplete(todo);
  }

  const handleEditTitleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isEditinigTitle) {
      return;
    }

    let isSuccessful = true;

    const newTrimmedTitle = newTitle.trim();

    if (!newTrimmedTitle.length) {
      isSuccessful = await handleDeleteTodo(id);
    } else if (newTrimmedTitle !== title) {
      isSuccessful = await handleUpdateTodo({
        id: id,
        title: newTrimmedTitle,
        userId: USER_ID,
        completed: completed,
      });
    }

    if (isSuccessful) {
      setNewTitle('');
      setIsEditinigTitle(false);
    } else {
      inputElement.current?.focus();
    }
  };

  const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleEditTitleStart = () => {
    setIsEditinigTitle(true);
    setNewTitle(title);
    if (inputElement.current) {
      inputElement.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditinigTitle(false);
      setNewTitle(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleMarkComplete}
        />
      </label>

      {isEditinigTitle ? (
        <form onSubmit={handleEditTitleSave}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChangeNewTitle}
            ref={inputElement}
            autoFocus
            onBlur={handleEditTitleSave}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditTitleStart}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
