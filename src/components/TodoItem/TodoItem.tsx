import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { TodosContext } from '../TodosContext/TodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { setTodos, setErrorMessage, resetError, loadingIds, setLoadingIds } =
    useContext(TodosContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = (todoId: number) => {
    setLoadingIds([todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.unableDelete);
        resetError();
      })
      .finally(() => setLoadingIds([]));
  };

  const handleToggle = (todoId: number, status: boolean) => {
    setLoadingIds([todoId]);

    updateTodo(todoId, { completed: !status })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === todoId
              ? { ...prevTodo, completed: !status }
              : prevTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.unableUpdate);
        resetError();
      })
      .finally(() => setLoadingIds([]));
  };

  const handleTitleUpdate = () => {
    setLoadingIds([id]);

    updateTodo(id, { title: editingTitle.trim() })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === id
              ? { ...prevTodo, title: editingTitle.trim() }
              : prevTodo,
          ),
        );
        setIsEditing(false);
      })
      .catch(() => {
        setLoadingIds([]);
        setErrorMessage(Errors.unableUpdate);
        resetError();
      })
      .finally(() => setLoadingIds([]));
  };

  const handleEditing = (event: React.FormEvent) => {
    event.preventDefault();

    if (title === editingTitle.trim()) {
      setIsEditing(false);
      setLoadingIds([]);

      return;
    }

    if (!editingTitle.trim()) {
      handleDelete(id);

      return;
    }

    handleTitleUpdate();
  };

  const handleCancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingTitle(title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggle(id, completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditing}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onKeyUp={handleCancelEditing}
            onBlur={handleEditing}
          />
        </form>
      ) : (
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
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
