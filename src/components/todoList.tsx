import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  deleteOneTodo: (id: number) => void;
  tempTodo: Todo | null;
  toggleTodo: (id: number) => void;
  currentId: number | null;
  setCurrentId: (id: number | null) => void;
  editedTodoId: number | null;
  setEditedTodoId: (id: number | null) => void;
  updateTitle: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteOneTodo,
  tempTodo,
  toggleTodo,
  currentId,
  setCurrentId,
  editedTodoId,
  setEditedTodoId,
  updateTitle,
}) => {
  const [editedTitle, setEditedTitle] = useState('');

  const handleDelete = (id: number) => {
    setCurrentId(id);
    deleteOneTodo(id);
  };

  const handleToggle = (id: number) => {
    setCurrentId(id);
    toggleTodo(id);
  };

  const handleDoubleClick = (id: number, title: string) => {
    setEditedTodoId(id);
    setEditedTitle(title);
  };

  const handleEditedTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTitle(event.target.value);
  };

  const handleBlur = (id: number, title: string) => {
    if (title.trim() !== '') {
      setEditedTodoId(null);
      updateTitle(id, title.trim());
    } else {
      deleteOneTodo(id);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    oldTitle: string,
    newTitle: string,
  ) => {
    if (event.key === 'Enter') {
      setCurrentId(id);
      event.preventDefault();
      handleBlur(id, newTitle);
    }

    if (event.key === 'Escape') {
      handleBlur(id, oldTitle);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label" htmlFor={todo.id.toString()}>
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              id={todo.id.toString()}
              onClick={() => handleToggle(todo.id)}
            />
          </label>

          {editedTodoId === todo.id ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={handleEditedTitleChange}
                onBlur={() => handleBlur(todo.id, editedTitle)}
                onKeyDown={event =>
                  handleKeyDown(event, todo.id, todo.title, editedTitle)
                }
                autoFocus
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(todo.id, todo.title)}
            >
              {todo.title}
            </span>
          )}

          {!editedTodoId && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': todo.id === currentId,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: tempTodo.completed })}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            className="todo__status-label"
            htmlFor={tempTodo.id.toString()}
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              id={tempTodo.id.toString()}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': tempTodo,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
