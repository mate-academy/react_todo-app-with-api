import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';
import * as TodoService from '../api/todos';
import { USER_ID } from '../types/userId';

export const Header: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const {
    todos,
    tempTodo,
    addTodo,
    updateTodo,
    handleSetTempTodo,
    handleSetErrorMessage,
    handleSetUpdatingIds,
  } = useContext(TodoContext);

  const isNotAllComplete = todos.some(({ completed }) => !completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetErrorMessage(Error.none);

    const newTodo = {
      title: newTitle.trim(),
      userId: USER_ID,
      completed: false,
    };

    if (!newTitle.trim()) {
      handleSetErrorMessage(Error.emptyTitle);

      return;
    }

    setDisableInput(true);

    handleSetTempTodo({ ...newTodo, id: 0 });
    TodoService.addTodo(newTodo)
      .then(todo => {
        addTodo(todo);
        setNewTitle('');
      })
      .catch(() => handleSetErrorMessage(Error.addTodo))
      .finally(() => {
        setDisableInput(false);
        handleSetTempTodo(null);
      });
  };

  const handleToggleAllTodos = () => {
    handleSetErrorMessage(Error.none);

    todos.forEach(todo => {
      if (todo.completed !== isNotAllComplete) {
        handleSetUpdatingIds(todo.id);

        TodoService.updateTodo({ ...todo, completed: isNotAllComplete })
          .then(() => updateTodo({ ...todo, completed: isNotAllComplete }))
          .catch(() => handleSetErrorMessage(Error.updateTodo))
          .finally(() => handleSetUpdatingIds(null));
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
