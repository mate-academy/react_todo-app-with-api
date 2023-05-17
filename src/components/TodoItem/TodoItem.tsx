import React, { ChangeEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { changeTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  tempTodoId?: number;
  updateTodo: (updatingTodo: Todo) => void;
  setErrorMessage: (errorMessage: string) => void;
  deleteTodo?: (deletingTodo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  tempTodoId,
  updateTodo = () => {},
  setErrorMessage,
  deleteTodo = () => {},
}) => {
  const { title, completed } = todo;
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);

  const handleUpdate = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    event?.preventDefault();

    const todoData = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      setIsDisabled(true);
      setIsLoading(true);

      const updatingTodo = await changeTodo(todo.id, todoData);

      updateTodo(updatingTodo);
    } catch {
      setErrorMessage('Unable to update todo');
    }

    setIsDisabled(false);
    setIsLoading(false);
  }, [completed]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdate}
          disabled={isDisabled}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={async () => {
          setIsLoading(true);
          deleteTodo?.(todo);
        }}
        disabled={isLoading}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
