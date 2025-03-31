/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  isLoadingTodo: number[];
  handleUpdateTodo: (todo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: (value: number | null) => void;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    handleDeleteTodo,
    isLoadingTodo,
    handleUpdateTodo,
    setEditingTodoId,
    editingTodoId,
  }) => {
    const [newTitle, setNewTitle] = useState(todo.title);

    const inputRef = useRef<HTMLInputElement>(null);
    const isEditing = editingTodoId === todo.id;

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleDoubleClick = () => {
      setEditingTodoId(todo.id);
      setNewTitle(todo.title);
    };

    const saveChanges = useCallback(() => {
      const trimmedTitle = newTitle.trim();

      if (trimmedTitle === todo.title) {
        setEditingTodoId(null);

        return;
      }

      if (trimmedTitle === '') {
        handleDeleteTodo(todo.id);

        return;
      }

      handleUpdateTodo({
        ...todo,
        title: trimmedTitle,
      });
    }, [newTitle, todo, handleUpdateTodo, handleDeleteTodo, setEditingTodoId]);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      saveChanges();
    };

    const handleOnBlur = () => {
      saveChanges();
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingTodoId(null);
      }
    };

    const onChange = () => {
      handleUpdateTodo({
        ...todo,
        completed: !todo.completed,
      });
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

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onBlur={handleOnBlur}
              onChange={event => setNewTitle(event.target.value)}
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
        {!editingTodoId && (
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
            'is-active': isLoadingTodo.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
