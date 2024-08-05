import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo.js';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  processedId: number[];
  handleCompletedStatus: (id: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoUser: React.FC<Props> = ({
  todo,
  onDelete,
  handleCompletedStatus,
  handleUpdateTodo,
  processedId,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);
  const { id, completed, title } = todo;

  const processedTodos = processedId?.includes(id) || id === 0;

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current && isEditingTodo) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  const handleBlur = async () => {
    if (isEditingTodo) {
      const titleTrim = isEditingTodo.title.trim();

      if (titleTrim === '') {
        onDelete(id);
      } else {
        try {
          await handleUpdateTodo({ ...isEditingTodo, title: titleTrim });
          setIsEditingTodo(null);
        } catch (error) {
          setIsEditingTodo(todo);
        }
      }
    }
  };

  const handleStatusChange = () => {
    handleCompletedStatus(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditingTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        {' '}
        <input
          id={`status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditingTodo?.id === id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditingTodo.title}
            onChange={e => setIsEditingTodo({ ...todo, title: e.target.value })}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={todoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditingTodo(todo);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processedTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
