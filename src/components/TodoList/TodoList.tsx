/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface PropsTodoList {
  todos: Todo[];
  isEdited: number;
  onEdited: (value: number) => void;
  loadingIds: number[];
  isCreating: boolean;
  onDelete: (todo: Todo) => void;
  tempTitle: string;
  onUpdate: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
}

export const TodoList: React.FC<PropsTodoList> = ({
  todos,
  isEdited,
  onEdited,
  loadingIds,
  isCreating,
  onDelete,
  tempTitle,
  onUpdate,
  onUpdateTitle,
}) => {
  const [tempEditTitle, setTempEditTitle] = React.useState('');

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos &&
        todos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', {
              completed: todo.completed,
              editing: isEdited === todo.id,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onUpdate(todo)}
              />
            </label>

            {isEdited === todo.id ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  onUpdateTitle(todo, tempEditTitle);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  autoFocus
                  value={tempEditTitle}
                  onChange={e => setTempEditTitle(e.target.value)}
                  onBlur={() => onUpdateTitle(todo, tempEditTitle)} // Збереження при виході
                  onKeyUp={e => {
                    if (e.key === 'Escape') {
                      onEdited(0); // Скасування
                    }
                  }}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    onEdited(todo.id);
                    setTempEditTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete(todo)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': loadingIds?.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

      {isCreating && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTitle}
          </span>

          <button type="button" className="todo__remove">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
