import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { UpdatingForm } from '../UpdatingForm';

type Props = {
  todo: Todo;
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
  onUpdateTodoStatus: (todo: Todo) => void;
  onUpdateTodo: (todoId: number, netTitle: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loadingTodos,
  deleteTodo,
  onUpdateTodoStatus,
  onUpdateTodo,
}) => {
  const {
    id, title, completed,
  } = todo;

  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = () => {
    onUpdateTodoStatus(todo);
  };

  const handleDeleteButton = () => {
    deleteTodo(id);
  };

  const handleEditTitle = () => {
    setIsUpdating(true);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleToggleComplete}
        />
      </label>

      {isUpdating
        ? (
          <UpdatingForm
            title={title}
            id={id}
            deleteTodo={deleteTodo}
            setIsUpdating={setIsUpdating}
            onUpdateTodo={onUpdateTodo}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleEditTitle}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteButton}
            >
              ×
            </button>

          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
