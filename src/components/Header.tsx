import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';
import * as todoService from '../api/todos';
import { USER_ID } from '../types/userId';

export const Header: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const {
    todos,
    tempTodo,
    addTodo,
    updateTodo,
    setTempTodo,
    setErrorMessage,
    SetUpdatingIds,
  } = useContext(TodoContext);

  const isNotAllComplete = todos.some(({ completed }) => !completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(Error.none);

    const newTodo = {
      title: newTitle.trim(),
      userId: USER_ID,
      completed: false,
    };

    if (!newTitle.trim()) {
      setErrorMessage(Error.emptyTitle);

      return;
    }

    setDisableInput(true);

    setTempTodo({ ...newTodo, id: 0 });
    todoService
      .addTodo(newTodo)
      .then(todo => {
        addTodo(todo);
        setNewTitle('');
      })
      .catch(() => setErrorMessage(Error.addTodo))
      .finally(() => {
        setDisableInput(false);
        setTempTodo(null);
      });
  };

  const handleToggleAllTodos = () => {
    setErrorMessage(Error.none);

    todos.forEach(todo => {
      if (todo.completed !== isNotAllComplete) {
        SetUpdatingIds(todo.id);

        todoService
          .updateTodo({ ...todo, completed: isNotAllComplete })
          .then(() => updateTodo({ ...todo, completed: isNotAllComplete }))
          .catch(() => setErrorMessage(Error.updateTodo))
          .finally(() => SetUpdatingIds(null));
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !isNotAllComplete,
          })}
          data-cy="ToggleAllButton"
          aria-label="toggle"
          onClick={handleToggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
