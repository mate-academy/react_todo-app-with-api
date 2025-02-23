/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todosBoot: number[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (
    todoId: number,
    title: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
};

const TodoItem: React.FC<Props> = ({
  todo,
  todosBoot,
  deleteTodo,
  updateTodo,
}) => {
  const { id, title, completed } = todo;

  const [selectTitle, setSelectTitle] = useState<string>(title);
  const [changeTitle, setChangeTitle] = useState<boolean>(false);

  useEffect(() => {
    setSelectTitle(title);
    setChangeTitle(false);
  }, [title]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [changeTitle]);

  const handleChangeTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTitle = selectTitle.trim();

    if (newTitle === title) {
      setChangeTitle(false);

      return;
    }

    if (newTitle === '') {
      deleteTodo(id);

      return;
    }

    updateTodo(id, newTitle)?.then(() => {
      setSelectTitle(newTitle);
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSelectTitle(title);
      setChangeTitle(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={event => updateTodo(id, selectTitle, event.target.checked)}
        />
      </label>

      {changeTitle ? (
        <form onSubmit={handleChangeTitleSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={selectTitle}
            onBlur={handleChangeTitleSubmit}
            onKeyUp={handleKeyUp}
            onChange={event => setSelectTitle(event.target.value)}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setChangeTitle(true)}
          >
            {selectTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': todosBoot.includes(id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
