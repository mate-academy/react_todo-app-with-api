import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useDeleteTodo } from '../../hooks/useDeleteTodo';
import { useTodos } from '../../utils/TodoContext';
import { ErrorType } from '../../types/ErrorType';
import { useToggleTodoStatus } from '../../hooks/useToggleTodoStatus';
import { patchTodo } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  isTemp?: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isTemp }) => {
  const { deleteTodo, isDeleting, error: deleteError } = useDeleteTodo();
  const { triggerFocus, setError, setTodos } = useTodos();
  const {
    toggleTodoStatus,
    error: toggleError,
    isToggling,
  } = useToggleTodoStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [showLoader, setShowLoader] = useState(false);

  const handleDelete = async () => {
    setShowLoader(true);
    const success = await deleteTodo(todo.id);

    if (!success) {
      setShowLoader(false);
      setError(ErrorType.UnableToDeleteTodo);
    } else {
      triggerFocus();
    }
  };

  const handleToggle = async () => {
    setShowLoader(true);
    const success = await toggleTodoStatus(todo.id, !todo.completed);

    if (!success) {
      setError(ErrorType.UnableToUpdateTodo);
    }

    setShowLoader(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      const input = document.getElementById(
        `edit-${todo.id}`,
      ) as HTMLInputElement;

      if (input) {
        input.focus();
      }
    }, 0);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleBlur = async () => {
    if (newTitle.trim() === '') {
      handleDelete();

      return;
    }

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setShowLoader(true);

    try {
      await patchTodo(todo.id, { title: newTitle });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? { ...t, title: newTitle } : t)),
      );
      setShowLoader(false);
      setIsEditing(false);
    } catch {
      setShowLoader(false);
      setError(ErrorType.UnableToUpdateTodo);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  useEffect(() => {
    if (deleteError || toggleError) {
      setError(deleteError || toggleError);
    }
  }, [deleteError, toggleError, setError]);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <input
          id={`edit-${todo.id}`}
          type="text"
          className="todo__input"
          value={newTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={isDeleting || isToggling}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`overlay ${isTemp || showLoader ? 'is-active' : ''}`}
        style={{ display: isTemp || showLoader ? 'flex' : 'none' }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
