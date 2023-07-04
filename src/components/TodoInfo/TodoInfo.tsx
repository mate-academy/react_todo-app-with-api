import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { UpdatingForm } from '../UpdatingForm';

type Props = {
  todo: Todo;
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (
    todoId: number,
    newTodoData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loadingTodos,
  deleteTodo,
  updateTodo,
}) => {
  const {
    id, title, completed,
  } = todo;

  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    await updateTodo(id, { completed: !todo.completed });
  };

  const handleDeleteButton = () => {
    deleteTodo(id);
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
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            setIsUpdating={setIsUpdating}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsUpdating(true)}
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
