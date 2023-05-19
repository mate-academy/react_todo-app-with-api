import React, { ChangeEvent, useCallback, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  tempTodoId?: number;
  onDelete?: (todoDelte: Todo) => void;
  updateTodo?: (todoId: number, completed: boolean) => Promise<void>;
  updateTitle?: (todoId: number, titles: string) => Promise<void>;
};

export const TodoInfo: React.FC<Props> = ({
  tempTodoId = 0,
  todo,
  onDelete = () => {},
  updateTodo = () => {},
  updateTitle = () => {},

}) => {
  const { completed, title } = todo;
  const isSuccess = completed === true;
  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const updateTodoHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateTodo(todo.id, event.target.checked);
    }, [todo.id],
  );

  const updateTodoTitle = async (previousTitle: string) => {
    setIsEditing(true);
    setNewTitle(previousTitle);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>
  | React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    updateTitle(todo.id, newTitle);
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle('');
    }
  };

  return (
    <div className={classNames('todo', {
      completed: isSuccess,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={updateTodoHandler}
        />
      </label>

      {isEditing
        ? (
          <form action="">
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onBlur={handleFormSubmit}
              onKeyUp={handleCancel}
              onChange={event => setNewTitle(event.target.value)}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => updateTodoTitle(todo.title)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={async () => {
                setIsLoading(true);

                await onDelete(todo);

                setIsLoading(false);
              }}
              disabled={isLoading}
            >
              ×
            </button>
          </>
        )}

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
