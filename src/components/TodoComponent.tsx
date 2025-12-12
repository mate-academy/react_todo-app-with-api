/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from './TodoStatus';

type Props = {
  todo: Todo;
  onUpdate: (todos: Todo[]) => Promise<void>;
  onDelete: (todos: Todo[]) => Promise<void>;
  completedTodos: number[] | null;
};

export const TodoComponent: React.FC<Props> = React.memo(
  ({ todo, onUpdate, onDelete, completedTodos }) => {
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
    const [updateTitle, setUpdateTitle] = useState(todo.title);

    const inputRef = useRef<HTMLInputElement>(null);
    const itemRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (inputRef) {
        inputRef.current?.focus();
        setUpdateTitle(todo.title);
      }

      if (itemRef) {
        setUpdateTitle(todo.title);
      }
    }, [isUpdatingTitle, todo.title, isUpdatingTitle]);

    const onSave = () => {
      if (updateTitle === todo.title) {
        setIsUpdatingTitle(false);

        return;
      } else if (updateTitle.trim().length === 0) {
        onDelete([todo])
          .then(() => setIsUpdatingTitle(false))
          .catch(() => {});
      } else {
        const { id, userId, completed } = todo;
        const newTodo = { id, userId, title: updateTitle.trim(), completed };

        onUpdate([newTodo])
          .then(() => setIsUpdatingTitle(false))
          .catch(() => {});
      }
    };

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <TodoStatus todo={todo} onUpdate={onUpdate} />

        {isUpdatingTitle && (
          <form>
            <input
              data-cy="TodoTitleField"
              ref={inputRef}
              value={updateTitle}
              type="text"
              className="todo__title-field"
              onChange={event => setUpdateTitle(event.target.value)}
              onBlur={() => onSave()}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onSave();
                }
              }}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setIsUpdatingTitle(false);
                }
              }}
            />
          </form>
        )}

        {!isUpdatingTitle && (
          <span
            ref={itemRef}
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsUpdatingTitle(true);
            }}
          >
            {todo.title}
          </span>
        )}

        {!isUpdatingTitle && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([todo])}
          >
            ×
          </button>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': completedTodos?.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoComponent.displayName = 'TodoComponent';
