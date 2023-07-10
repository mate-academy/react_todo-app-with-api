import React, { useState } from 'react';
import cn from 'classnames';

import { Todo, TodoUpdateData } from '../../types/Todo';
import { UpdatingTodos } from '../UpdateTodoForm';

type Props = {
  todo: Todo,
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (
    todoId: number,
    newTodoData: TodoUpdateData,
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

  const handleDeleteButton = () => {
    deleteTodo(id);
  };

  const handleToggleComplete = async () => {
    await updateTodo(id, { completed: !todo.completed });
  };

  const handleApdatingTodo = () => setIsUpdating(true);

  const isTodoActive = loadingTodos.includes(id);

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
          <UpdatingTodos
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
              onDoubleClick={handleApdatingTodo}
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
        'is-active': isTodoActive,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
