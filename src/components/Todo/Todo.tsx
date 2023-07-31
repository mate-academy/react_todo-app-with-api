import React, { useState } from 'react';
import cn from 'classnames';

import './Todo.scss';
import { TodoType } from '../../types/TodoType';

type Props = {
  todo: TodoType;
  onDelete: (todoId: number) => Promise<void>;
  ids: number[];
  updatedStatus: number[];
  onChangeStatus: (todo: TodoType) => Promise<void>;
  onChangeTitle: (todo: TodoType) => Promise<void>;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  ids,
  updatedStatus,
  onChangeStatus,
  onChangeTitle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  function handleLoading<T>(
    cause: (param: T) => Promise<void>,
    param: T,
  ): void {
    setIsLoading(true);

    cause(param)
      .finally(() => {
        setIsLoading(false);
      });
  }

  const { id, title } = todo;

  const deleteTodo = () => {
    handleLoading<number>(onDelete, id);
  };

  const updateStatus = () => {
    handleLoading<TodoType>(onChangeStatus, todo);
  };

  const handleIsInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsInput(!isInput);

    if (!newTitle) {
      setIsLoading(true);

      onDelete(id)
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    if (title !== newTitle) {
      setIsLoading(true);

      onChangeTitle({ ...todo, title: newTitle })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onDoubleClick = () => {
    setIsInput(!isInput);
    setNewTitle(title);
  };

  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>) => (
    setNewTitle(event.target.value)
  );

  const resetChanges = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsInput(!isInput);
      setNewTitle(title);
    }
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={updateStatus}
        />
      </label>

      {isInput ? (
        <form
          onSubmit={handleIsInput}
          onBlur={handleIsInput}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleSetTitle}
            onKeyUp={resetChanges}
            // eslint-disable-next-line
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodo}
            disabled={isLoading || ids.includes(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isLoading
              || ids.includes(id)
              || updatedStatus.includes(id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
