/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, updatedTodo: Todo) => void;
  setError: (error: Error) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos, onDelete, onUpdate, setError,
  }) => {
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [loadingStates, setLoadingStates] = useState<boolean[]>(
      todos.map(() => false),
    );

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleStartEditing = (todoId: number, title: string) => {
      setEditingTodoId(todoId);
      setNewTitle(title);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const findTodoById = (todoId: number): Todo | undefined => {
      return todos.find((todo) => todo.id === todoId);
    };

    const updateTodoTitle = async (todoId: number, title: string) => {
      try {
        const todoToUpdate = findTodoById(todoId);

        if (todoToUpdate) {
          setLoadingStates((prevStates) => {
            const updatedStates = [...prevStates];

            updatedStates[todoId] = true;

            return updatedStates;
          });

          await onUpdate(todoId, { ...todoToUpdate, title });
          setError(Error.NONE);
        }
      } catch (error) {
        setError(Error.UPDATE);
      } finally {
        setLoadingStates((prevStates) => {
          const updatedStates = [...prevStates];

          updatedStates[todoId] = false;

          return updatedStates;
        });
      }
    };

    const handleSaveEditing = async (todoId: number, title: string) => {
      if (!title.trim()) {
        onDelete(todoId);
      } else {
        await updateTodoTitle(todoId, title);
        setEditingTodoId(null);
        setNewTitle('');
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      todoId: number,
    ) => {
      if (e.key === 'Enter') {
        handleSaveEditing(todoId, newTitle);
      }
    };

    const toggleTodoStatus = (todoId: number, completed: boolean) => {
      const todoToUpdate = findTodoById(todoId);

      if (todoToUpdate) {
        onUpdate(todoId, { ...todoToUpdate, completed: !completed });
      }
    };

    return (
      <section className="todoapp__main">
        {todos.map(({ id, completed, title }) => {
          const isEditing = editingTodoId === id;
          const isLoading = loadingStates[id] && isEditing;

          return (
            <div
              key={id}
              className={classNames('todo', { completed, editing: isEditing })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() => toggleTodoStatus(id, completed)}
                />
              </label>

              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEditing(id, newTitle);
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    className={classNames('todo__edit-input', {
                      'todo__edit-input--full-width': isEditing,
                    })}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => handleSaveEditing(id, newTitle)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                  />
                  <button type="submit" className="todo__remove">
                    ×
                  </button>
                </form>
              ) : (
                <span
                  className="todo__title"
                  onDoubleClick={() => handleStartEditing(id, title)}
                >
                  {title}
                </span>
              )}

              {!isEditing && (
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onDelete(id)}
                >
                  ×
                </button>
              )}

              <div className="loader-overlay">
                <div
                  className={classNames('modal overlay', {
                    'is-active': isLoading,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    );
  },
);
