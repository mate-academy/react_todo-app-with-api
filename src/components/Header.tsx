import classNames from 'classnames';
import React, { RefObject } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  setErrorName: React.Dispatch<React.SetStateAction<string>>,
  onSetQuery: React.Dispatch<React.SetStateAction<string>>,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>,
  onPostNewTodo: (value: string) => void,
  isAdding: boolean,
  toggleAll: () => void,
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoField,
  title,
  onSetQuery,
  setHasError,
  setErrorName,
  onPostNewTodo,
  isAdding,
  toggleAll,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetQuery(e.target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    if (!title.length) {
      setHasError(true);
      setErrorName("Title can't be empty");
    }

    if (title.length) {
      onPostNewTodo(title);
    }
  };

  const checkedToggleAll = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: checkedToggleAll })}
          aria-label="button"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
