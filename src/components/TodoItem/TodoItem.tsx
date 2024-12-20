/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  deletingId: number[];
  filteredTodos: Todo[];
  setErrorMessage: (message: string) => void;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  deletingId,
  filteredTodos,
  setErrorMessage,
  loadingIds,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleComplete = (todoToggle: Todo) => {
    onUpdate({
      ...todoToggle,
      completed: !todoToggle.completed,
    });
  };

  const handleUpdate = () => {
    if (editingTodoId !== null) {
      const updatedTodo = filteredTodos.find(
        todoItem => todoItem.id === editingTodoId,
      );

      if (updatedTodo) {
        if (newTodoTitle.trim() === '') {
          onDelete(updatedTodo.id);
        } else {
          const newTitle = newTodoTitle.trim();

          setLoading(true);

          onUpdate({
            ...updatedTodo,
            title: newTitle,
          })
            .then(() => {
              setNewTodoTitle('');
              setEditingTodoId(null);
              setOpen(false);
            })
            .catch(() => {
              setErrorMessage('Unable to update a todo');
            })
            .finally(() => {
              setLoading(false);
              setTimeout(() => setErrorMessage(''), 3000);
            });
        }
      }
    }
  };

  const handleEditTodo = (id: number, title: string) => {
    setOpen(true);
    setEditingTodoId(id);
    setNewTodoTitle(title);
  };

  const handleBlur = () => {
    if (open) {
      handleUpdate();
    }
  };

  useEffect(() => {
    if (open && editingTodoId === todo.id) {
      inputRef.current?.focus();
    }
  }, [editingTodoId, open, todo.id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
      setOpen(false);
      setNewTodoTitle('');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (todo.title === newTodoTitle) {
        setOpen(false);
        setNewTodoTitle('');
        setEditingTodoId(null);
      } else {
        handleUpdate();
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleComplete(todo)}
        />
      </label>

      {open && editingTodoId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={loading}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEditTodo(todo.id, todo.title)}
        >
          {todo.title}
        </span>
      )}

      {!open && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={
            deletingId.includes(todo.id) ||
            loadingIds.includes(todo.id) ||
            loading
          }
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            deletingId.includes(todo.id) ||
            loadingIds.includes(todo.id) ||
            loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
