import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  doPost: () => void;
  changheCompletedValue: () => void;
  inputValue: string;
  doDisable: boolean;
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  setInputValue: (p: string) => void;
};

export const Header: React.FC<Props> = ({
  doPost,
  inputValue,
  doDisable,
  todos,
  changheCompletedValue,
  inputRef,
  setInputValue,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          onClick={() => changheCompletedValue()}
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          const value: string = (e.target as HTMLFormElement).elements[0].value;

          doPost(value);
        }}
      >
        <input
          ref={inputRef}
          autoFocus
          disabled={doDisable}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
