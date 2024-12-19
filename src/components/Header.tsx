import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  mainInputRef: React.RefObject<HTMLInputElement>;
  onCreate: () => void;
  toggleAll: () => void;
  isDisabletField: boolean;
  title: string;
  setTitle: (t: string) => void;
};

const Header: React.FC<Props> = ({
  todos,
  mainInputRef,
  onCreate,
  toggleAll,
  isDisabletField,
  title,
  setTitle,
}) => {
  const createTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onCreate();
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={toggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={createTodo}>
        <input
          data-cy="NewTodoField"
          name="NewTodoField"
          type="text"
          ref={mainInputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isDisabletField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default Header;
