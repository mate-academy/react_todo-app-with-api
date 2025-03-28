/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo, USER_ID } from '../../api/todos';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  todos: Todo[];
  isAdd: boolean;
  isChange: boolean;
  isDelete: boolean;
  tempId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsDelete: (value: boolean) => void;
  setErrorMessage: (message: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isChange,
  isDelete,
  isAdd,
  tempId,
  setTodos,
  setIsDelete,
  setErrorMessage,
}) => {
  const { title, id, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [isEditTodo, setIsEditTodo] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isEsc, setIsEsc] = useState(false);
  const [isError, setIsError] = useState(false);
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isError || isEditTodo) {
      inputFocus.current?.focus();
      setIsEditTodo(true);
    }
  }, [isEditTodo, isError]);

  useEffect(() => {
    if (isEditTodo) {
      inputFocus.current?.focus();

      window.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsEsc(true);
        }
      });
    }
  }, [isEditTodo]);

  useEffect(() => {
    if (isDelete) {
      setIsDelete(false);
    }
  }, [isDelete, setIsDelete]);
  const handleDeleteTodo = async () => {
    try {
      setIsLoading(true);
      await deleteTodo(id);

      setTodos((prevTodos: Todo[]) => {
        return prevTodos.filter((currentTodo: Todo) => currentTodo.id !== id);
      });
      setIsDelete(true);
    } catch {
      setErrorMessage('Unable to delete a todo');

      if (!editTitle.trim().length) {
        setIsEditTodo(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (editTitle.trim().length) {
      if (editTitle.trim() !== title.trim()) {
        const newTodo = { ...todo, title: editTitle.trim() };

        setIsLoading(true);
        updateTodo(id, newTodo)
          .then(updatedTodo => {
            setTodos((prevTodos: Todo[]) =>
              prevTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              ),
            );

            setIsError(false);
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');
            setIsError(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      handleDeleteTodo();
    }

    setIsEditTodo(false);

    if (isEsc) {
      setIsEsc(false);
    }
  };

  useEffect(() => {
    if (isEditTodo && isEsc) {
      handleSubmitEdit();
    }
  }, [isEditTodo, isEsc]);

  const handleSwitchCheck = () => {
    const newTodo = { ...todo, completed: !completed };

    setIsLoading(true);

    updateTodo(id, newTodo)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
        'item-enter-done': !completed && USER_ID !== id,
        'temp-item-enter temp-item-enter-active': isAdd && USER_ID === id,
      })}
    >
      <label className="todo__status-label" htmlFor="todo-checkbox">
        <input
          id="todo-checkbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleSwitchCheck}
        />
      </label>

      {isEditTodo ? (
        <form onSubmit={e => handleSubmitEdit(e)}>
          <input
            ref={inputFocus}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={text => setEditTitle(text.target.value)}
            onBlur={() => handleSubmitEdit()}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditTodo(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading ||
            (isAdd && USER_ID === id) ||
            (isChange && tempId.includes(todo.id)) ||
            (isDelete && tempId.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
