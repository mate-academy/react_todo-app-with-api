import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo
  updateTodos: (todo: Todo) => void
  handleTodoStatusChange: (todo: Todo) => void
  setErrorMessage?: (message: string) => void
  removeTodo?: (id: number) => void
  loadingItems: number[]
  setLoadingItems: (id: (prevState: number[]) => number[]) => void
};

export const TodoElement: React.FC<Props> = ({
  todo,
  updateTodos,
  handleTodoStatusChange,
  setErrorMessage,
  removeTodo,
  loadingItems,
  setLoadingItems,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleDelete = (id: number) => {
    setLoadingItems((prevState) => [...prevState, id]);
    client.delete(`/todos/${id}`)
      .then(() => {
        if (removeTodo === undefined) {
          return;
        }

        removeTodo(id);
      })
      .catch(() => {
        if (setErrorMessage === undefined) {
          return;
        }

        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setLoadingItems((prevState) => prevState
        .filter((stateId) => id !== stateId)));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEdited(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (editedTitle === todo.title) {
      setEditedTitle('');
      setIsEdited(false);

      return;
    }

    if (editedTitle === '') {
      handleDelete(todo.id);

      return;
    }

    const data = {
      ...todo,
      title: editedTitle,
    };

    setLoadingItems((prevState) => [...prevState, todo.id]);
    client
      .patch<Todo>(`/todos/${todo.id}`, data)
      .then(() => {
        updateTodos(data);
        setEditedTitle('');
        setIsEdited(false);
      })
      .catch(() => {
        if (setErrorMessage === undefined) {
          return;
        }

        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingItems((prevState) => prevState
          .filter((stateId) => todo.id !== stateId));
        setEditedTitle('');
        setIsEdited(false);
      });
  };

  const handleLoading = (id: number): boolean => {
    return loadingItems.some((item) => item === id);
  };

  return (
    <div
      data-cy="Todo"
      className={
        classNames(['todo'], { completed: todo.completed })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            handleTodoStatusChange(todo);
          }}
          checked={todo.completed}
        />
      </label>

      {isEdited && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          onBlur={(event) => handleSubmit(event)}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onKeyUp={(event) => handleKeyUp(event)}
          />
        </form>
      )}

      {!isEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEdited(true);
              setEditedTitle(todo.title);
            }}
          >
            {editedTitle || todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', { 'is-active': handleLoading(todo.id) })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
