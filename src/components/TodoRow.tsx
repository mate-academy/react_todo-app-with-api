// import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isEditing: number,
  isDeleting: number,
  isChanged: number,
  isChangingStatus: number,
  setIsEditing: (id: number) => void,
  onTodoDelete: (id: number) => Promise<void>,
  onChangeComplited: (todo: Todo) => void,
  onTodoChange: (todo: Todo, newTitle: string) => void,
};

export const TodoRow: React.FC<Props> = ({
  todos,
  tempTodo,
  isEditing,
  isDeleting,
  isChanged,
  isChangingStatus,
  setIsEditing,
  onTodoDelete,
  onChangeComplited,
  onTodoChange,
}) => {
  const [editedTitle, setEditedTitle] = useState('');

  const handleTitleEdit = (todo: Todo) => {
    if (editedTitle === todo.title) {
      setIsEditing(0);
      setEditedTitle('');
      return;
    }

    if (editedTitle === '') {
      onTodoDelete(todo.id);
      return;
    }

    onTodoChange(todo, editedTitle);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
          onDoubleClickCapture={() => {
            setIsEditing(todo.id);
            setEditedTitle(todo.title);
          }}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                onChangeComplited({
                  ...todo,
                  completed: !todo.completed,
                });
              }}
            />
          </label>

          {todo.id === isEditing
            ? (<form
              onBlur={() => {
                handleTitleEdit(todo);
              }}
              onSubmit={(event) => {
                event.preventDefault();
                handleTitleEdit(todo)
              }}
              onKeyUp={(event) => {
                if (event.key === "Escape") {
                  setIsEditing(0);
                  setEditedTitle('');
                }
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
              />
            </form>)
            : (<>
              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onTodoDelete(todo.id)}
              >
                ×
              </button>
            </>)}

          <div
            data-cy="TodoLoader"
            className={cn('modal', 'overlay', {
              'is-active': isDeleting === todo.id
              || isChanged === todo.id
              || isChangingStatus === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo
        && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo?.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
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
