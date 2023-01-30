import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField';

export type Props = {
  todo: Todo,
  onDeleteTodo(id: number): void,
  isLoading: boolean,
  onChangeStatus(id: number, status: boolean): void,
  onRenameTodo(id: number, str: string): void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
  onChangeStatus,
  onRenameTodo,
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const onInputChange = (str: string) => {
    setNewTitle(str);
  };

  const onTitleEditting = async (str: string) => {
    setIsEditting(false);

    const title = str.trim();

    if (title) {
      if (todo.title !== title) {
        onRenameTodo(todo.id, title);
      }
    } else {
      onDeleteTodo(todo.id);
    }
  };

  const onCancelEditting = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Escape') {
      setIsEditting(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onChangeStatus(todo.id, todo.completed)}
        />
      </label>

      {!isEditting
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditting(true)}
            >
              {todo.title}
            </span>
            {!isLoading && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => onDeleteTodo(todo.id)}
              >
                ×
              </button>
            )}
          </>
        ) : (
          <TodoTitleField
            newTitle={newTitle}
            onInputChange={onInputChange}
            onTitleEditting={onTitleEditting}
            onCancelEditting={onCancelEditting}
          />
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
