/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { useTodos } from './TodoContext';
import { ErrorText } from '../types/ErrorText';
import * as todosServices from '../api/todos';

interface Props {
  todo: Todo;
}

export const TodoItems: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { deleteTodo, handleCompleted, setTodos, setErrMessage } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const updateTodoTitle = async () => {
    setLoading(true);
    try {
      const updatedTodo = (await todosServices.updateTodo(id, {
        ...todo,
        title: newTitle,
      })) as Todo;

      setTodos((prevTodos: Todo[]) => {
        return prevTodos.map((prevTodo: Todo) =>
          prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
        );
      });

      setIsEditing(false);
    } catch (error) {
      if (newTitle.trim() === '') {
        setErrMessage(ErrorText.DeleteErr);
      } else {
        setErrMessage(ErrorText.UpdateErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = async () => {
    if (newTitle.trim() === '') {
      await deleteTodo(id);
    } else if (newTitle !== title) {
      await updateTodoTitle();
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (newTitle.trim() === '') {
        await deleteTodo(id);
      } else if (newTitle !== title) {
        await updateTodoTitle();
      } else {
        setIsEditing(false);
      }
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompleted(todo)}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          className="todoapp__edit"
          value={newTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          disabled={loading}
          placeholder="Empty todo will be deleted"
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {loading && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
