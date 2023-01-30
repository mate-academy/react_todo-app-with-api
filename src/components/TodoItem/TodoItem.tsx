import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  updateTodo: (id: number) => void;
  areAllUpdating: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  updateTodo,
  areAllUpdating,
}) => {
  const { id, completed, title } = todo;
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [todo]);

  const handleTodoUpdate = (todoId: number) => {
    setIsLoading(true);
    updateTodo(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed && 'completed'}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleTodoUpdate(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        { title }
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(id);
          setIsDeleting(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': id === isDeleting || isLoading || areAllUpdating,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
