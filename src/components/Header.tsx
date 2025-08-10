import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  todos: Todo[];
  titleInputRef: React.LegacyRef<HTMLInputElement>;
  tempTodo: Todo | null;
  input: string;
  activeTodos: number[];
  setInput: (input: string) => void;
  handleTodoSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlUpdateAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  titleInputRef,
  tempTodo,
  input,
  activeTodos,
  setInput,
  handleTodoSubmit,
  handlUpdateAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            handlUpdateAll();
          }}
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          ref={titleInputRef}
          type="text"
          disabled={!!tempTodo}
          value={input}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={e => {
            handleTodoSubmit(e);
          }}
          onChange={e => {
            setInput(e.target.value);
          }}
        />
      </form>
    </header>
  );
};
