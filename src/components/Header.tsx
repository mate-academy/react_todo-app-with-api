import {
  ChangeEvent, FormEvent, useContext, useState,
} from 'react';
import classNames from 'classnames';
import { GlobalContext } from '../context/GlobalContext';
import { ErrorEnum } from '../types/ErrorEnum';
import { USER_ID } from '../constants';

export const Header = () => {
  const [query, setQuery] = useState('');

  const {
    addTodo,
    todos,
    setErrorAndClear,
    isInputDisabled,
    setTempTodo,
    areAllTodosCompleted,
    toggleAllTodos,
  } = useContext(GlobalContext);

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      setErrorAndClear(ErrorEnum.EMPTY_TITLE, 3000);

      return;
    }

    if (query.trim()) {
      const todo = {
        title: query,
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);
      addTodo({
        title: query,
        userId: USER_ID,
        completed: false,
      });
    }

    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: areAllTodosCompleted })}
          aria-label="Toggle All"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          onChange={onQueryChange}
          value={query}
        />
      </form>
    </header>
  );
};
