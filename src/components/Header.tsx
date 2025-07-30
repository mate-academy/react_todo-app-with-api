import React, { RefObject, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  title: string;
  onChange: (title: string) => void;
  onAdd: (title: string) => void;
  todoList: Todo[];
  toggleAllTodos: () => void;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onChange,
  onAdd,
  todoList,
  toggleAllTodos,
  inputRef,
  disabled,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title.trim());
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todoList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active:
              todoList.length > 0 && todoList.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="title"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleChange}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
