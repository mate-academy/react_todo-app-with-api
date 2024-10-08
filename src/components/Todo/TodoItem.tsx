/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { useEffect, useRef, useState } from 'react';
import { Error } from '../../types/Error';
import { setLoadingState } from '../../utils/loadingHandler';

type Props = {
  onDelete: (todoId: number) => void;
  todo: TodoType;
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  setErrorMessage: (errorMessage: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  setTodos,
  setErrorMessage,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  const handleToggleStatus = () => {
    setTodos(currentTodos => setLoadingState(currentTodos, [todo.id], true));
    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            return currentTodo.id === updatedTodo.id
              ? { ...updatedTodo, loading: false }
              : currentTodo;
          });
        });
      })
      .catch(() => setErrorMessage && setErrorMessage(Error.PATCH))
      .finally(() => {
        setTodos(currentTodos =>
          setLoadingState(currentTodos, [todo.id], false),
        );
      });
  };

  const handleTodoTitleUpdate = () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsBeingEdited(false);
      setEditedTitle(trimmedTitle);

      return;
    }

    setTodos(currentTodos => setLoadingState(currentTodos, [todo.id], true));

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            return currentTodo.id === updatedTodo.id
              ? { ...updatedTodo, loading: false }
              : currentTodo;
          });
        });

        setIsBeingEdited(false);
        setEditedTitle(trimmedTitle);
      })
      .catch(() => {
        setErrorMessage(Error.PATCH);
      })
      .finally(() =>
        setTodos(currentTodos =>
          setLoadingState(currentTodos, [todo.id], false),
        ),
      );
  };

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleTodoTitleUpdate();
  }

  function handleCloseOnKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();

    if (event.key === 'Escape') {
      setIsBeingEdited(false);
      setEditedTitle(todo.title);
    }
  }

  useEffect(() => {
    if (isBeingEdited && titleField.current) {
      titleField.current.focus();
    }
  }, [isBeingEdited, titleField]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {' '}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggleStatus}
          checked={todo.completed}
        />
      </label>
      {isBeingEdited && (
        <form onSubmit={handleFormSubmit}>
          <input
            value={editedTitle}
            data-cy="TodoTitleField"
            ref={titleField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleTodoTitleUpdate}
            onKeyUp={handleCloseOnKeyUp}
          />
        </form>
      )}
      {!isBeingEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsBeingEdited(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete && onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
