/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import * as todoService from '../api/todos';

type Props = {
  todo: Todo;
  errorMessage: string;
  loading?: boolean;
  onRemoveTodo: (id: number) => Promise<void>;
  onUpdateTodo: (id: number) => Promise<void>;
  editing: number | null;
  setEditing: (id: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setLoading: Dispatch<SetStateAction<number[]>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  todos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onRemoveTodo,
  onUpdateTodo,
  editing,
  setEditing,
  inputRef,
  setTodos,
  setLoading,
  setErrorMessage,
  todos,
}) => {
  const { id, title, completed } = todo;

  const [originalTitle, setOriginalTitle] = useState(title);
  const [editableTitle, setEditableTitle] = useState(title);

  useEffect(() => {
    if (editing === id && inputRef.current) {
      inputRef.current.focus();
      setOriginalTitle(title);
      setEditableTitle(title);
    }
  }, [editing, id, inputRef, title]);

  const handleTitleChange = (newTitle: string) => {
    setEditableTitle(newTitle);
  };

  const completeEditing = async (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (todoToUpdate) {
      const trimmedTitle = editableTitle.trim();

      if (trimmedTitle.trim().length === 0) {
        try {
          await todoService.deleteTodo(todoId);
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        } catch (error) {
          setErrorMessage('Unable to delete a todo');
        }
      } else if (trimmedTitle.trim() !== todoToUpdate.title) {
        try {
          await todoService.updateTodo(todoId, { title: trimmedTitle });
          setTodos(prev =>
            prev.map(todo =>
              todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
            ),
          );
          setEditing(null);
        } catch (error) {
          setErrorMessage('Unable to update a todo');
        } finally {
          setLoading(prev => prev.filter(i => i !== todoId));
        }
      } else {
        setEditing(null);
      }
    } else {
      setEditing(null);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={id}
          checked={completed}
          onChange={() => onUpdateTodo(id)}
        />
      </label>

      {editing === id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editableTitle}
            onChange={e => handleTitleChange(e.target.value)}
            onBlur={() => completeEditing(id)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                completeEditing(id);
              }

              if (e.key === 'Escape') {
                e.preventDefault();
                setEditableTitle(originalTitle);
                setEditing(null);
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditing(id)}
        >
          {title}
        </span>
      )}

      {editing !== id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onRemoveTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
