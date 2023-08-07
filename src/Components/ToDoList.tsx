import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, updatedTodo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, onDelete, onUpdate }) => {
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [isLoading] = useState(false);

    const handleStartEditing = (todoId: number, title: string) => {
      setEditingTodoId(todoId);
      setNewTitle(title);
    };

    const findTodoById = (todoId: number): Todo | undefined => {
      return todos.find(todo => todo.id === todoId);
    };

    const updateTodoTitle = (todoId: number, title: string) => {
      const todoToUpdate = findTodoById(todoId);

      if (todoToUpdate) {
        onUpdate(todoId, { ...todoToUpdate, title });
      }
    };

    const handleSaveEditing = (todoId: number, title: string) => {
      if (!title.trim()) {
        return;
      }

      setEditingTodoId(null);
      updateTodoTitle(todoId, title);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>,
      todoId: number) => {
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

        {isLoading && (
          <div className="loader-overlay">
            <div className="loader" />
          </div>
        )}

        {todos.map(({ id, completed, title }) => {
          const isEditing = editingTodoId === id;

          return (
            <div
              key={id}
              className={classNames(
                'todo',
                { completed, editing: isEditing },
              )}
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
                <>
                  <input
                    type="text"
                    className="todo__edit-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => handleSaveEditing(id, newTitle)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                  />
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => onDelete(id)}
                  >
                    ×
                  </button>
                </>
              ) : (
                <span
                  className="todo__title"
                  onDoubleClick={() => handleStartEditing(id, title)}
                >
                  {title}
                </span>
              )}

              {isEditing || (
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onDelete(id)}
                >
                  ×
                </button>
              )}

              <div
                className={classNames('modal overlay', {
                  'is-active': isEditing,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
              {isLoading && (
                <div className="loader-overlay">
                  <div className="loader" />
                </div>
              )}
            </div>
          );
        })}
      </section>
    );
  },
);
