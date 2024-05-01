import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useAppContext } from '../context/Context';

interface Props {
  todoData: Todo;
}
export const TodoItem: React.FC<Props> = ({ todoData }) => {
  const {
    state: { loadingItems },
    updateTodo,
    deleteTodo,
    setLoadingItems,
  } = useAppContext();

  const loading = loadingItems.includes(todoData.id);
  // const [loading, setIsLoading] = useState(loadingState);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(todoData.title);

  const inputTitleRef = useRef<HTMLInputElement>(null);

  const handleCompleted = () => {
    setLoadingItems([todoData.id]);
    updateTodo({ ...todoData, completed: !todoData.completed }).finally(() =>
      setLoadingItems([]),
    );
  };

  const handleDelete = (id: number) => {
    setLoadingItems([todoData.id]);
    deleteTodo(id).finally(() => {
      setLoadingItems([]);
    });
  };

  const handleDoubleClick = () => setEditMode(true);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTitleSave = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle !== todoData.title) {
      if (!title.trim()) {
        handleDelete(todoData.id);

        return;
      }

      setLoadingItems([todoData.id]);
      updateTodo({ ...todoData, title: title.trim() })
        .then(() => setEditMode(false))
        .catch(() => inputTitleRef.current?.focus())
        .finally(() => {
          setLoadingItems([]);
        });
    } else {
      setEditMode(false);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditMode(false);
      setTitle(todoData.title);
    } else if (event.key === 'Enter') {
      handleTitleSave();
    }
  };

  useEffect(() => {
    if (editMode) {
      inputTitleRef.current?.focus();
    }
  }, [editMode]);

  useEffect(() => {
    if (editMode) {
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keyup', handleKeyUp);
      };
    }

    return;
  });

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todoData.completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoData.completed}
          onChange={handleCompleted}
        />
      </label>

      {editMode ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            ref={inputTitleRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onBlur={handleTitleSave}
            onChange={e => handleTitleChange(e)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todoData.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todoData.id)}
          >
            ×
          </button>
        </>
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
