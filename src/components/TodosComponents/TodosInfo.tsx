import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo,
  isAdding?: boolean,
  deletingTodo?: (id: number) => void,
  idsForLoader: number[],
  changeTodo: (id: number, changes: Partial<Todo>) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todos,
  isAdding,
  deletingTodo,
  idsForLoader,
  changeTodo,
}) => {
  const { title, id, completed } = todos;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormExist, setIsFormExist] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const TodoField = useRef<HTMLInputElement>(null);
  const LoaderCondition = isAdding || isDeleting || idsForLoader.includes(id);

  useEffect(() => {
    if (TodoField.current) {
      TodoField.current.focus();
    }
  }, [isFormExist]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        TodoField.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTodoRemoval = async () => {
    if (deletingTodo) {
      setIsDeleting(true);

      await deletingTodo(id);

      setIsDeleting(false);
    }
  };

  const handlerForUpdatingTodo = async () => {
    if (changeTodo) {
      setIsDeleting(true);

      if (!completed) {
        await changeTodo(id, { completed: true });
      } else {
        await changeTodo(id, { completed: false });
      }

      setIsDeleting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim() === '') {
      handleTodoRemoval();
    }

    if (newTitle !== title) {
      setIsDeleting(true);
      setIsFormExist(false);
      await changeTodo(id, { title: newTitle });
      setIsDeleting(false);
    }

    setIsFormExist(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label
        className="todo__status-label"
        onChange={handlerForUpdatingTodo}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isFormExist
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={TodoField}
              onBlur={handleSubmit}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
            />
          </form>
        )
        : (
          <>
            <span
              onClickCapture={(event) => {
                if (event.detail === 2) {
                  setIsFormExist(true);
                }
              }}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleTodoRemoval}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': LoaderCondition,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
