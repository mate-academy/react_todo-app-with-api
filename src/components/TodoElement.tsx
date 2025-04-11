/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useCallback, useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
  loadingTodoIds: number[];
  updateTodoId: number | null;
  setUpdateTodoId: (value: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoElement: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleUpdateTodo,
  loadingTodoIds,
  updateTodoId,
  setUpdateTodoId,
  inputRef,
}: Props) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const editTodo = updateTodoId === todo.id;

  useEffect(() => {
    if (editTodo && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [editTodo, inputRef]);

  const handleDoubleClick = () => {
    setUpdateTodoId(todo.id);
    setNewTitle(todo.title);
  };

  const changeSave = useCallback(() => {
    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setUpdateTodoId(null);

      return;
    }

    if (normalizedTitle === '') {
      handleDeleteTodo(todo.id);

      return;
    }

    handleUpdateTodo({
      ...todo,
      title: normalizedTitle,
    });
  }, [newTitle, todo, handleUpdateTodo, handleDeleteTodo, setUpdateTodoId]);

  const handleOnBlur = () => {
    changeSave();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    changeSave();
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setUpdateTodoId(null);
    }
  };

  const handleChange = () => {
    handleUpdateTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

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
          checked={todo.completed}
          onChange={handleChange}
        />
      </label>

      {editTodo ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onBlur={handleOnBlur}
            onChange={ev => setNewTitle(ev.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!updateTodoId && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
