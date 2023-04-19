import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleRemoveTodo?: (id: number) => void;
  isLoading: boolean;
  handleChangeTodoStatus: (id: number) => void;
  changeTitle: (id: number, title: string) => void;
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    handleRemoveTodo,
    isLoading,
    handleChangeTodoStatus,
    changeTitle,
  }) => {
    const [isActiveForm, setIsActiveForm] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpdateTitleOnBlur = useCallback(
      () => {
        if (newTitle === todo.title) {
          setIsActiveForm(false);

          return;
        }

        changeTitle(todo.id, newTitle);
        setIsActiveForm(false);
      }, [isActiveForm, newTitle],
    );

    const handleUpdateTitle = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newTitle === todo.title) {
          setIsActiveForm(false);

          return;
        }

        handleUpdateTitleOnBlur();
      }, [isActiveForm, newTitle],
    );

    const handleAddKeyUpEventListener = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setNewTitle(todo.title);
          setIsActiveForm(false);
        }
      }, [],
    );

    useEffect(() => {
      document.addEventListener('keyup', handleAddKeyUpEventListener);

      return () => {
        document.removeEventListener('keyup', handleAddKeyUpEventListener);
      };
    }, []);

    useEffect(() => {
      if (isActiveForm) {
        inputRef.current?.focus();
      }
    }, [isActiveForm]);

    return (
      <div
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onClick={() => handleChangeTodoStatus(todo.id)}
            checked={todo.completed}
          />
        </label>

        {isActiveForm ? (
          <form onSubmit={handleUpdateTitle}>
            <input
              ref={inputRef}
              type="text"
              onBlur={() => handleUpdateTitleOnBlur()}
              disabled={!isActiveForm}
              className="todoapp__new-todo"
              style={{
                paddingLeft: 15,
              }}
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
            />

          </form>
        ) : (
          <span
            className="todo__title"
            onDoubleClick={() => setIsActiveForm(true)}
          >
            {todo.title}
          </span>
        )}

        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            if (handleRemoveTodo) {
              handleRemoveTodo(todo.id);
            }
          }}
        >
          ×
        </button>

        <div className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
