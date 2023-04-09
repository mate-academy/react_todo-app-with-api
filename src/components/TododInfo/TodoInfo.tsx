import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleRemoveTodo?: (id: number) => void;
  loadingTodoIds: number[];
  handleUpdateTodoCompleted: (id: number) => void;
  changeTitleByDoubleClick: (id: number, title: string) => void;
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    handleRemoveTodo,
    loadingTodoIds,
    handleUpdateTodoCompleted,
    changeTitleByDoubleClick,
  }) => {
    const [isActiveForm, setIsActiveForm] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);

    const isInDeleteList = loadingTodoIds.some(id => todo.id === id);

    const handleUpdateTitleOnBlur = useCallback(
      () => {
        if (newTitle === todo.title || newTitle.length === 0) {
          setIsActiveForm(false);
          setNewTitle(todo.title);

          return;
        }

        changeTitleByDoubleClick(todo.id, newTitle);
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

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNewTitle(todo.title);
        setIsActiveForm(false);
      }
    });

    return (
      <div
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onClick={() => handleUpdateTodoCompleted(todo.id)}
            checked={todo.completed}
          />
        </label>

        {isActiveForm ? (
          <form onSubmit={handleUpdateTitle}>
            <input
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
          { 'is-active': isInDeleteList },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
