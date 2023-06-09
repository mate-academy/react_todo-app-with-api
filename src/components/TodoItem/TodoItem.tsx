import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  todosLoading: number[],
  todosUpdate: (id: number, data: Partial<Todo>) => void,
  deleteTodo: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todosLoading,
  todosUpdate,
  deleteTodo,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;
  const [isEditable, setIsEditable] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClickOnTitle = () => {
    if (!todosLoading.includes(id)) {
      setIsEditable(true);
      inputRef.current?.focus();
    }
  };

  const handleEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(event.target.value);
  };

  const applyChanges = () => {
    if (!currentTitle) {
      deleteTodo(id);
    } else {
      todosUpdate(id, { title: currentTitle });
    }
  };

  const handleApplyChanges = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyChanges();
      setIsEditable(false);
    }

    if (e.key === 'Escape') {
      setCurrentTitle(title);
      setIsEditable(false);
    }
  };

  const handleOnBlur = () => {
    applyChanges();
    setIsEditable(false);
  };

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditable]);

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
          defaultChecked={completed}
          onChange={() => todosUpdate(id, { completed: !completed })}
        />
      </label>

      {isEditable ? (
        <form onSubmit={applyChanges}>
          <input
            type="text"
            className="todoapp__edit-todo"
            placeholder="What needs to be done?"
            value={currentTitle}
            onChange={handleEditTitle}
            onKeyDown={handleApplyChanges}
            onBlur={handleOnBlur}
            disabled={todosLoading.includes(id)}
            ref={inputRef}
          />
        </form>
      )
        : (
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClickOnTitle}
          >
            {currentTitle}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosLoading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
