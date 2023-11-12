import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { } from '../../api/todos';
import { UpdatingData } from '../../types/UpdatingData';

type Props = {
  todo: Todo;
  selectedTodoId?: number[];
  isDisableInput?: boolean;
  onUpdate?: (
    { todo, key, value }: UpdatingData,
    setIsActiveInput: (value: boolean) => void,
  ) => void;
  onDelete?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodoId = [],
  isDisableInput = false,
  onUpdate = () => {},
  onDelete = () => {},
}) => {
  const {
    id,
    completed,
    title,
  } = todo;
  const [newTodoTitle, setNewTodoTitle] = useState(title);
  const [isActiveInput, setIsActiveInput] = useState(false);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsActiveInput(false);
        setNewTodoTitle(title);
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = isDisableInput || selectedTodoId.includes(id);

  const onBblur = () => {
    setTimeout(() => {
      if (newTodoTitle === title) {
        setIsActiveInput(false);

        return;
      }

      if (!newTodoTitle.trim()) {
        onDelete(id);

        return;
      }

      onUpdate({
        todo,
        key: 'title',
        value: newTodoTitle.trim(),
      }, setIsActiveInput);
    }, 100);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle === title) {
      setIsActiveInput(false);

      return;
    }

    if (!newTodoTitle.trim()) {
      onDelete(id);

      return;
    }

    onUpdate(
      { todo, key: 'title', value: newTodoTitle.trim() },
      setIsActiveInput,
    );
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={() => setIsActiveInput(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate({
            todo,
            key: 'completed',
            value: !todo.completed,
          }, setIsActiveInput)}
        />
      </label>

      {isActiveInput ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            onBlur={onBblur}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
