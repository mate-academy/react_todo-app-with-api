/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<any>;
  loadingId: number[];
  updateTodo: (todoId: number) => Promise<any>,
  updateTodoTitle: (todoId: number) => Promise<any>,
  changeTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loadingId,
  updateTodo,
  updateTodoTitle,
  changeTodoTitle,
  newTodoTitle,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const selectedField = useRef<HTMLInputElement>(null);

  const handleSwitch = () => {
    setIsTodoLoading(true);
    updateTodo(todo.id).finally(() => setIsTodoLoading(false));
  };

  const enterEditMode = () => {
    changeTodoTitle(todo.title);
    setIsEdited(true);
  };

  const clearEditFields = () => {
    changeTodoTitle('');
    setIsEdited(false);
  };

  const handleDelete = () => {
    setIsTodoLoading(true);
    deleteTodo(todo.id).finally(() => setIsTodoLoading(false));
  };

  const handleTitleChange = () => {
    if (newTodoTitle === todo.title) {
      clearEditFields();

      return;
    }

    if (!newTodoTitle || newTodoTitle.trim() === '') {
      clearEditFields();
      handleDelete();
    }

    if (newTodoTitle) {
      setIsTodoLoading(true);
      updateTodoTitle(todo.id).finally(() => setIsTodoLoading(false));
      clearEditFields();
    }
  };

  useEffect(() => {
    if (selectedField.current) {
      selectedField.current.focus();
    }
  }, [isEdited]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleChange();
  };

  const keySubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleTitleChange();
    }
  };

  const keyCancel = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      clearEditFields();
    }
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeTodoTitle(event.target.value);
  };

  const onLostFocus = () => {
    handleTitleChange();
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={enterEditMode}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isTodoLoading}
          onChange={handleSwitch}
        />
      </label>

      {!isEdited && (
        <>
          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
            disabled={isTodoLoading}
          >
            ×
          </button>
        </>
      )}

      {(isEdited) && (
        <form
          onSubmit={onSubmit}
        >
          <input
            type="text"
            disabled={isTodoLoading}
            className="todo__title-field"
            placeholder="Delete empty todo"
            ref={selectedField}
            value={newTodoTitle}
            onChange={changeTitle}
            onBlur={onLostFocus}
            onKeyDown={keySubmit}
            onKeyUp={keyCancel}
          />
        </form>
      )}

      <div className={classNames('modal overlay', {
        'is-active': loadingId.includes(todo.id) || isTodoLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
