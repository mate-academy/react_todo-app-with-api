import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  areAllCompleted: boolean;
  addPost: (title: string) => void;
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  todoList: Todo[];
  toggleAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  areAllCompleted,
  addPost,
  isLoading,
  inputValue,
  setInputValue,
  inputRef,
  todoList,
  toggleAllTodos,
}) => {
  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    addPost(inputValue);
  };

  return (
    <header className="todoapp__header">
      {!!todoList.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
