import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  isLoading: boolean;
  changeTodo: (todo: Todo, title?: string) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  handleDeleteTodo,
  isLoading,
  changeTodo,
}) => {
  const { title, completed, id } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isDoubleClicked) {
      inputRef.current?.focus();
    }
  }, [isDoubleClicked]);

  const onChangeTodo = () => {
    changeTodo(todo);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeTodo(todo, newTitle);
    setIsDoubleClicked(false);
  };

  const handleOnBlur = () => {
    changeTodo(todo, newTitle);
    setIsDoubleClicked(false);
  };

  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const closeFormByEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
    }
  };

  const setDoubleClicked = () => {
    setIsDoubleClicked(true);
  };

  const handleRemoveTodo = () => {
    handleDeleteTodo(id);
  };

  return (
    <div
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onChangeTodo}
        />
      </label>

      {isDoubleClicked ? (
        <form
          onSubmit={handleOnSubmit}
          onBlur={handleOnBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={handleSetTitle}
            onKeyDown={closeFormByEsc}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={setDoubleClicked}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div className={cn(
        'modal',
        'overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
