import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Error } from '../../types/Error';
import { TodosContext } from '../TodosContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {};

export const Header: React.FC<Props> = () => {
  const { isSubmiting, setIsSubmiting } = useContext(TodosContext);
  const [value, setValue] = useState('');

  const {
    todos,
    setErrorMessage,
    addTodo,
    updateTodo,
    USER_ID,
  } = useContext(TodosContext);

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmiting]);

  const isChecked = todos.every(todo => todo.completed) && todos.length > 0;

  const handleToggleAll = () => {
    const isAllCheked = todos.every(todo => todo.completed);
    const isAllActive = todos.every(todo => !todo.completed);

    if (isAllCheked || isAllActive) {
      todos.map(todo => updateTodo({ ...todo, completed: !isAllCheked }));
    } else {
      todos.filter(todo => !todo.completed)
        .map(todo => updateTodo({ ...todo, completed: true }));
    }
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage(Error.Default);

    const trimmedTitle = value.trim();

    if (!trimmedTitle) {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    const todo = {
      title: value.trim(),
      completed: false,
      userId: USER_ID,
    };

    setIsSubmiting(true);

    addTodo(todo)
      .then(() => setValue(''))
      .finally(() => setIsSubmiting(false));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: isChecked })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
