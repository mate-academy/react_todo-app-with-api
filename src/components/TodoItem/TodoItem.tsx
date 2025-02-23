import React, { useCallback, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';
import * as errors from '../../Errors/Errors';
import { wait } from '../../utils/fetchClient';

interface Props {
  todo: Todo;
  deleteTodoHandler: (todoId: number) => void;
  addTodoId: number | null;
  updateTodoTitleById: (currentTodo: Todo) => void;
  updateCompletedTodoById: (todoId: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setAddTodoId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodoHandler,
  addTodoId,
  updateTodoTitleById,
  updateCompletedTodoById,
  setLoading,
  setErrorMessage,
  setAddTodoId,
}) => {
  const { id, title, completed } = todo;

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editRef = useRef<HTMLInputElement>(null);

  const editHandler = () => {
    setIsEdit(true);
    setTimeout(() => editRef.current?.focus(), 0);
  };

  const onDelete = useCallback(() => {
    deleteTodoHandler(id);
  }, [id, deleteTodoHandler]);

  const onChangeTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editTitle.trim()) {
      onDelete();

      return;
    }

    if (editTitle === title) {
      setIsEdit(false);
    }

    setLoading(true);
    setAddTodoId(id);

    const updatedTodo: Todo = {
      ...todo,
      title: editTitle,
    };

    updateTodos(updatedTodo)
      .then(() => {
        updateTodoTitleById(updatedTodo);
      })
      .catch(() => {
        setErrorMessage(errors.UNABLE_TO_UPDATE);

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
        setIsEdit(false);
      });
  };

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const onBlurHandler = () => {
    setIsEdit(false);
  };

  const onCompleted = () => {
    setLoading(true);

    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    setAddTodoId(id);

    const checkbox = document.getElementById(
      `checkbox-${id}`,
    ) as HTMLInputElement | null;

    if (checkbox) {
      checkbox.disabled = true;
    }

    updateTodos(updatedTodo)
      .then(() => {
        updateCompletedTodoById(id);
      })
      .catch(() => {
        setErrorMessage(errors.UNABLE_TO_UPDATE);

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);

        if (checkbox) {
          checkbox.disabled = false;
        }
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      onDoubleClick={editHandler}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onCompleted}
        />
      </label>

      {!isEdit && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {editTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      {isEdit && (
        <form onSubmit={onChangeTitle}>
          <input
            type="text"
            className="todo__title-field edit"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={titleChangeHandler}
            ref={editRef}
            onBlur={onBlurHandler}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': addTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
