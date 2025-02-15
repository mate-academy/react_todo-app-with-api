import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { deleteTodo, patchTodo } from '../api/todos';

interface Props {
  todo: Todo;
  loading?: boolean;
  setTodos: (value: (current: Todo[]) => Todo[]) => void;
  handleError: (value: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading = false,
  setTodos,
  handleError,
}) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [isEditing]);

  const handleDeleteTodo = () => {
    setIsLoading(true);
    deleteTodo(todo.id)
      .then(() => {
        setTodos(current => current.filter(el => el.id !== todo.id));
        setIsEditing(false);
      })
      .catch(() => {
        handleError('Unable to delete a todo');
        editInputRef.current?.focus();
      })
      .finally(() => setIsLoading(false));
  };

  const handlePatchTodo = (changes: Partial<Omit<Todo, 'id'>>) => {
    const updatedTodo = { ...todo, ...changes };

    setIsLoading(true);
    patchTodo(updatedTodo)
      .then(() => {
        setTodos(current =>
          current.map(el => (el.id === todo.id ? updatedTodo : el)),
        );
        setIsEditing(false);
      })
      .catch(() => {
        handleError('Unable to update a todo');
        setIsChecked(todo.completed);
        editInputRef.current?.focus();
      })
      .finally(() => setIsLoading(false));
  };

  const handleToggle = () => {
    setIsChecked(prev => !prev);
    handlePatchTodo({ completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle.trim()) {
      handleDeleteTodo();

      return;
    }

    handlePatchTodo({ title: newTitle.trim() });
  };

  const handleESCEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', 'is-active')}
        >
          <div className="modal-background" />
          <div className="loader" />
        </div>
      )}

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleToggle}
        />
      </label>
      {isEditing ? (
        <form onSubmit={e => handleFormSubmit(e)}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={`editInput-${todo.id}`}>
            <input
              data-cy="TodoTitleField"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleFormSubmit}
              onKeyUp={handleESCEvent}
              ref={editInputRef}
            />
          </label>
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
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteTodo}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
