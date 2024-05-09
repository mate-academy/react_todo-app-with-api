/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from 'react';
import cn from 'classnames';
// import { ListAct } from '../types/Actions';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoContext';
// import { USER_ID } from '../api/todos';
// import * as api from '../api/todos';

type Props = {
  todo: Todo;
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, loading = false }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(todo.title.trim());
  const [isLoading, setIsLoading] = useState(loading);
  const { deleteTodo, updateTodo } = useContext(TodoContext);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDelete = (id: number) => {
    setIsLoading(true);
    deleteTodo(id).finally(() => setIsLoading(false));
    // dispatch({ type: 'deleteTodo', payload: todo.id });
  };

  const handleFormSubmit = () => {
    const newTitle = title.trim();

    setIsEdit(false);
    // setIsLoading(true);
    if (newTitle !== todo.title) {
      if (!newTitle) {
        // dispatch({ type: ListAct.Delete, payload: todo.id });
        // handleDelete(todo.id);
        setIsLoading(true);
        deleteTodo(todo.id)
          .catch(() => setIsEdit(true))
          .finally(() => setIsLoading(false));
        // dispatch({ type: 'deleteTodo', payload: todo.id });
        // setError('Unable to delete todos');
      } else {
        setIsLoading(true);
        updateTodo({ ...todo, title: newTitle })
          .catch(() => setIsEdit(true))
          .finally(() => setIsLoading(false));
      }

      // dispatch({
      //   type: 'updateTodo',
      //   payload: {
      //     id: todo.id,
      //     title: title.trim(),
      //     userId: USER_ID,
      //     completed: false,
      //   },
      // });
    } else {
      setIsEdit(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEdit(false);
    } else if (event.key === 'Enter') {
      setTitle(title.trim());
      handleFormSubmit();
    }
  };

  const handleBlur = () => {
    setTitle(title.trim());
    handleFormSubmit();
  };

  const handleComplete = () => {
    setIsLoading(true);
    updateTodo({ ...todo, completed: !todo.completed }).finally(() =>
      setIsLoading(false),
    );
    // dispatch({
    //   type: ListAct.SetComplet,
    //   payload: { id: todo.id, completed: !todo.completed },
    // });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleComplete}
        />
      </label>

      {isEdit ? (
        <form
          onSubmit={(element: React.FormEvent<HTMLFormElement>): void => {
            element.preventDefault();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            autoFocus
            onChange={handleFormChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEdit(true);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', { 'is-active': isLoading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
