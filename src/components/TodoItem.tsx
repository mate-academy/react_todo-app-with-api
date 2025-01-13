/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import * as Methods from '../api/todos';

interface TodoItemProps {
  todo: Todo;
  loadingTodoId: number | null;
  deleteTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number, completed: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  updateTodo: (todoId: number, newTitle: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodoId,
  deleteTodo,
  toggleTodoStatus,
  setErrorMessage,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [localLoadingTodoId, setLocalLoadingTodoId] = useState<number | null>(
    null,
  );

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const handleBlur = async () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      try {
        setLocalLoadingTodoId(todo.id);
        await deleteTodo(todo.id);
      } catch (error) {
        setErrorMessage('Unable to delete the todo');
      } finally {
        setLocalLoadingTodoId(null);
      }
    } else if (trimmedTitle !== todo.title) {
      try {
        setLocalLoadingTodoId(todo.id);
        await Methods.updateTodo(todo.id, { title: trimmedTitle });
        updateTodo(todo.id, trimmedTitle);
        setIsEditing(false);
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLocalLoadingTodoId(null);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      await handleBlur();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const isLoaderActive =
    loadingTodoId === todo.id || localLoadingTodoId === todo.id;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label
        htmlFor={`todo-checkbox-${todo.id}`}
        className="todo__status-label"
      >
        <input
          id={`todo-checkbox-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
