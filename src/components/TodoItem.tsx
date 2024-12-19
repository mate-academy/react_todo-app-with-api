/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState, useCallback, useRef, useEffect } from 'react';

type Props = {
  handleDeleteTodo: (todoId: Todo['id']) => void;
  handleChangeCompletion: (todo: Todo, newIsCompleted: boolean) => void;
  isBeingEdited?: boolean;
  isTemp?: boolean;
  todo: Todo;
  todoBeingUpdated: number | null;
  updateTodoTitle: (todo: Todo, newTitle: string) => void;
};

const getTodoClass = (todo: Todo) =>
  classNames({
    todo: true,
    completed: todo.completed,
  });

export const TodoItem: React.FC<Props> = ({
  handleChangeCompletion,
  handleDeleteTodo,
  isBeingEdited,
  isTemp = false,
  todo,
  todoBeingUpdated,
  updateTodoTitle,
}) => {
  const [isBeingRemoved, setRemoval] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo.title);

  const todoTitleInput = useRef<HTMLInputElement>(null);

  const finishEditingTodo = useCallback(() => {
    setIsFormOpen(false);
    setNewTodoTitle(newTodoTitle);
  }, [newTodoTitle]);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        finishEditingTodo();
      }
    },
    [finishEditingTodo],
  );

  const handleUpdateTodoFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodoTitle.trim().length) {
      setRemoval(true);
    }

    if (todo.title === newTodoTitle) {
      setIsFormOpen(false);

      return;
    }

    updateTodoTitle(todo, newTodoTitle);

    Promise.resolve(() => {
      if (todoBeingUpdated === null) {
        finishEditingTodo();
        document.removeEventListener('keyup', handleEscapeKey);
      }
    });
  };

  useEffect(() => {
    if (isFormOpen) {
      todoTitleInput.current?.focus();
    }
  }, [isFormOpen]);

  const handleDoubleClick = useCallback(() => {
    setIsFormOpen(true);
    document.addEventListener('keyup', event => handleEscapeKey(event));
  }, [handleEscapeKey]);

  const handleBlur = useCallback(() => {
    updateTodoTitle(todo, newTodoTitle);
    setIsFormOpen(false);
    setNewTodoTitle(newTodoTitle);
  }, [newTodoTitle, todo, updateTodoTitle]);

  return (
    <div
      data-cy="Todo"
      className={getTodoClass(todo)}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            event.preventDefault();
            handleChangeCompletion(todo, !todo.completed);
          }}
          readOnly
        />
      </label>

      {isFormOpen && (
        <form onSubmit={handleUpdateTodoFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            ref={todoTitleInput}
          />
        </form>
      )}

      {!isFormOpen && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setRemoval(true);
              handleDeleteTodo(todo.id);
            }}
          >
            Delete task!
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames({
          modal: true,
          overlay: true,
          'is-active': isTemp || isBeingRemoved || isBeingEdited,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
