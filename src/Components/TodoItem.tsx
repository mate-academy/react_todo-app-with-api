/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { CustomInputEditEvent } from '../App';
import { deleteTodo, patchTodo } from '../api/todos';

type TodoItemProps = {
  todo: Todo;
  setError: (value: string | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setDeletUpdatTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  // onDelete: (id: Todo['id']) => void;
  // onToggle: (id: number) => void;
  // isUpdating?: boolean;
  isDeletUpdating?: boolean;
  isTemporary?: boolean;
  // editingId: number | null;
  // editingTitle: string;
  // setEditingTitle: (title: string) => void;
  // handleEditKeyDown: (e: CustomInputEditEvent, id: number) => void;
  // handleDoubleClick: (id: number, currentTitle: string) => void;
  // handleBlur: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  setError,
  setDeletUpdatTodoIds,
  setTodos,
  // onDelete,
  // onToggle,
  // isUpdating = false,
  isDeletUpdating = false,
  isTemporary = false,
  // editingId,
  // editingTitle,
  // setEditingTitle,
  // handleEditKeyDown,
  // handleDoubleClick,
  // handleBlur,
}) => {
  // const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  // const [deletUpdatTodoIds, setDeletUpdatTodoIds] = useState<number[]>([]);
  // const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const { id, title, completed } = todo;
  // const [todos, setTodos] = useState<Todo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (todoId: number, currentTitle: string) => {
    setEditingId(todoId);
    setEditingTitle(currentTitle);
  };

  const handleUpdate = async (todoId: number) => {
    const newTitle = editingTitle.trim();

    if (!newTitle) {
      setError('Title should not be empty');

      return;
    }

    try {
      setDeletUpdatTodoIds(prev => [...prev, todoId]);
      const updatedTodo = await patchTodo(todoId, { title: newTitle });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todoId ? updatedTodo : t))
      );
      setEditingId(null);
      setEditingTitle('');
    } catch (e) {
      setError(`Unable to update a todo ${e}`);
    } finally {
      setDeletUpdatTodoIds(prev =>
        prev.filter((deletingId: number) => deletingId !== todoId),
      );
    }
  };

  const handleEditKeyDown = (e: CustomInputEditEvent, todoId: number) => {
    if (e.key === 'Enter') {
      handleUpdate(todoId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditingTitle(title);
      e.preventDefault();
    }
  };

  const handleDelete = (todoId: Todo['id']) => {
    setDeletUpdatTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prev: Todo[]) => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletUpdatTodoIds(prev =>
          prev.filter(deletingId => deletingId !== todoId),
        );
      });
  };

  const handleBlur = () => {
    if (editingTitle.trim() === '') {
      handleDelete(editingId as number);
    } else if (editingTitle !== title) {
      handleUpdate(editingId as number);
    } else {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const toggleTodo = (todoId: number) => {
    const currentTodo = todo.id === todoId ? todo : null;

    if (!currentTodo) {
      return;
    }

    setDeletUpdatTodoIds(prev => [...prev, todoId]);

    patchTodo(todoId, { completed: !currentTodo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todoId
              ? { ...t, completed: updatedTodo.completed }
              : t,
          ),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setDeletUpdatTodoIds(prev =>
          prev.filter(deletingId => deletingId !== todoId));
      });
  };

  useEffect(() => {
    if (editingId === id) {
      inputRef.current?.focus();
    }
  }, [editingId, id]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        <input
          id={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(id)}
          disabled={isDeletUpdating}
        />
      </label>

      {editingId === id ? (
        <form onKeyDown={e => handleEditKeyDown(e as CustomInputEditEvent, id)}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={handleBlur}
            placeholder="Empty todo will be deleted"
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDoubleClick(id, title)}
        >
          {title}
        </span>
      )}
      {editingId !== id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(id)}
          disabled={isDeletUpdating}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeletUpdating || isTemporary,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
