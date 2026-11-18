/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoEditForm } from './TodoEditForm';

export type TodoItemActions = {
  onDelete: (todoId: number, shouldFocusNewTodo?: boolean) => Promise<boolean>;
  onToggle: (todoId: number, completed: boolean) => void;
  onRename: (todoId: number, title: string) => Promise<boolean>;
};

type Props = {
  todo: Todo;
  isProcessed?: boolean;
} & (({ isTemp?: false } & TodoItemActions) | { isTemp: true });

export const TodoItem: React.FC<Props> = props => {
  const { todo, isProcessed = false } = props;
  const [isEditing, setIsEditing] = useState(false);
  const isBusy = props.isTemp === true || isProcessed;

  const handleStartEditing = () => {
    if (!isBusy) {
      setIsEditing(true);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isBusy}
          onChange={
            props.isTemp
              ? undefined
              : event => props.onToggle(todo.id, event.currentTarget.checked)
          }
        />
      </label>

      {!props.isTemp && isEditing ? (
        <TodoEditForm
          initialTitle={todo.title}
          isProcessed={isBusy}
          onSave={title =>
            title
              ? props.onRename(todo.id, title)
              : props.onDelete(todo.id, false)
          }
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isBusy}
            onClick={props.isTemp ? undefined : () => props.onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isBusy,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
