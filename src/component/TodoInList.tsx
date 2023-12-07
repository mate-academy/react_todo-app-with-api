import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  loadingTodosIds: number[],
  setLoadingTodosIds: (ids: number[]) => void,
  deleteTodo: (todoId: number) => Promise<void>,
  updateTodo: (todo: Todo) => Promise<void>,
};

export const TodoInList: React.FC<Props> = React.memo(({
  todo,
  loadingTodosIds,
  setLoadingTodosIds,
  deleteTodo,
  updateTodo,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (event.target.value.trim() === '') {
        deleteTodo(todo.id);

        return;
      }

      const update: Todo = { ...todo, title: newTitle };

      updateTodo(update);

      setIsEdit(false);
    }

    if (event.key === 'Escape') {
      setIsEdit(false);

      setNewTitle(todo.title);
    }
  }

  function handleDeleteTodo() {
    setLoadingTodosIds([todo.id]);
    deleteTodo(todo.id);
  }

  function handleInputChecked() {
    setLoadingTodosIds([todo.id]);
    updateTodo({ ...todo, completed: !todo.completed });
  }

  return (
    <>
      <div className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleInputChecked}
          />
        </label>

        {isEdit ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputRef}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={() => setIsEdit(false)}
              onKeyDown={handleOnKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEdit(true)}
            >
              {todo.title}
            </span>

            <button
              className="todo__remove"
              type="button"
              onClick={handleDeleteTodo}
            >
              x
            </button>
          </>
        )}

        <div
          className={cn('modal overlay',
            { 'is-active': loadingTodosIds?.includes(todo.id) })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
});
