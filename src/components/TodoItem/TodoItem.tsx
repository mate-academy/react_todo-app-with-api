import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => Promise<void>;
  loadingTodoId: number[];
  loading?: boolean;
  updateTodo: (id: number, data: string | boolean) => Promise<void>;
  setErrorText: (text: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo, removeTodo, loadingTodoId, loading, updateTodo, setErrorText,
}) => {
  const { id, title, completed } = todo;
  const [todoTitle, setTodoTitle] = useState(title);
  const [prevTitle, setPrevTitle] = useState(title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFocus = useCallback(() => {
    setIsUpdating(true);
    setPrevTitle(title);
  }, [title]);

  const handleComplete = useCallback(() => (
    updateTodo(id, !completed)
  ), [id, completed, updateTodo]);

  const handleRemoval = useCallback(
    () => removeTodo(id), [removeTodo, id],
  );

  const handleEdit = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoTitle(event.target.value);
    }, [],
  );

  const handleBlur = useCallback(() => {
    if (!todoTitle.length) {
      removeTodo(id)
        .then(() => setIsUpdating(false))
        .catch(() => setErrorText('Unable to remove a todo'));
    } else {
      updateTodo(id, todoTitle)
        .then(() => setIsUpdating(false))
        .catch(() => setErrorText('Unable to update a todo'));
    }
  }, [id, todoTitle, removeTodo, updateTodo]);

  const handleInput = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setTodoTitle(prevTitle);
        setIsUpdating(false);
      }

      if (event.key === 'Enter') {
        if (todoTitle.length === 0) {
          removeTodo(id).then(() => setIsUpdating(false))
            .catch(() => setErrorText('Unable to remove a todo'));
        } else {
          updateTodo(id, todoTitle).then(() => setIsUpdating(false))
            .catch(() => setErrorText('Unable to update a todo'));
        }

        setIsUpdating(false);
      }
    }, [id, todoTitle, prevTitle, removeTodo, updateTodo],
  );

  return (
    <div
      key={id}
      className={
        classNames('todo', { completed })
      }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={handleComplete}
        />
      </label>

      {!isUpdating ? (
        <span
          className="todo__title"
          onDoubleClick={handleFocus}
          onBlur={handleBlur}
        >
          {todoTitle}
        </span>
      ) : (
        <input
          className="todo__title todo__title-input"
          value={todoTitle}
          onChange={handleEdit}
          onBlur={handleBlur}
          onKeyUp={handleInput}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoval}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': loadingTodoId.includes(id) || loading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
