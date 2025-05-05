import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';

type TodoItemProps = {
  todo: Todo;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  isLoad?: boolean;
  processingTodoIds?: number[];
  inputTodoRef?: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({
    todo,
    isLoad,
    setTodos = () => {},
    setError = () => {},
    processingTodoIds,
    inputTodoRef,
  }) => {
    const { completed, title, id } = todo;
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const editInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (isLoad) {
        setIsLoading(true);
      }

      const needLoad = processingTodoIds?.some(
        processingId => processingId === id,
      );

      if (needLoad) {
        setIsLoading(true);
      }

      return () => setIsLoading(false);
    }, [isLoad, processingTodoIds, id]);

    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setEditedTitle(title);
          setIsEditing(false);
        }
      };

      window.addEventListener('keyup', handleEsc);

      return () => window.removeEventListener('keyup', handleEsc);
    }, [title]);

    const handleDelete = () => {
      setIsLoading(true);

      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
        })
        .catch(() => setError('Unable to delete a todo'))
        .finally(() => {
          setIsLoading(false);
          inputTodoRef?.current?.focus();
        });
    };

    const handleTodoStatus = async () => {
      try {
        setIsLoading(true);
        const updatedTodo = await updateTodo(id, { completed: !completed });

        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      } catch {
        setError(`Unable to update a todo`);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSaveTitle = async (event: React.FormEvent) => {
      event.preventDefault();
      const trimmedNewTitle = editedTitle.trim();

      if (trimmedNewTitle === title) {
        setIsEditing(false);

        return;
      }

      if (!trimmedNewTitle) {
        handleDelete();

        return;
      }

      try {
        setIsLoading(true);
        const updatedTodo = await updateTodo(id, { title: trimmedNewTitle });

        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          if (index === -1) {
            return currentTodos;
          }

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });

        setIsEditing(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Unable to update a todo', error);
        setError('Unable to update a todo');
        editInputRef.current?.focus();
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
        })}
      >
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleTodoStatus}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleSaveTitle}>
            <input
              ref={editInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              disabled={isLoading}
              autoFocus
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
              onClick={handleDelete}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading,
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
