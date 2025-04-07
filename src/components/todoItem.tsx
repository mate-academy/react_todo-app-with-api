/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  loadingTodo: number[];
  todosStatusChange: (todo: Todo) => void;
  editTodoId: number | null;
  setEditTodoId: (value: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
  todosStatusChange,
  editTodoId,
  setEditTodoId,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const editing = editTodoId === todo.id;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const onChange = () => {
    todosStatusChange({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleDoubleClick = () => {
    setEditTodoId(todo.id);
    setNewTitle(todo.title);
  };

  const save = useCallback(() => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditTodoId(null);

      return;
    }

    if (trimmedTitle === '') {
      removeTodo(todo.id);

      return;
    }

    todosStatusChange({
      ...todo,
      title: trimmedTitle,
    });
  }, [newTitle, todo, todosStatusChange, removeTodo, setEditTodoId]);

  const handleBlur = () => {
    save();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTodoId(null);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save();
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onChange}
        />
      </label>

      {/* <span data-cy="TodoTitle" className="todo__title">
        {todos.title}
      </span> */}

      {editing ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            autoFocus
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

      {/* Remove button appears only on hover */}
      {!editing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodo.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

TodoItem.displayName = 'TodoItem';
