import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { USER_ID } from '../../constants/credentials';
import {
  TITLE_EMPTY_ERROR,
  UNABLE_TO_ADD_ERROR,
  UNABLE_TO_UPDATE_ERROR,
} from '../../constants/errors';
import { TodoContext } from '../../contexts/TodoContext';
import { createTodoApi, updateTodoApi } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    tempTodo,
    addTodoHandler,
    updateTodoHandler,
    setUpdatingTodosIdsHandler,
    setErrorHandler,
    setTempTodoHandler,
  } = useContext(TodoContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const areAllTodosCompleted = todos.every(({ completed }) => completed);

  useEffect(() => {
    titleInput.current?.focus();
  }, [todos.length, tempTodo]);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    const newTodo = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    event.preventDefault();
    setErrorHandler('');

    if (!todoTitle.trim()) {
      setErrorHandler(TITLE_EMPTY_ERROR);

      return;
    }

    setIsLoading(true);

    setTempTodoHandler({ ...newTodo, id: 0 });
    createTodoApi(newTodo)
      .then(todo => {
        addTodoHandler(todo);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorHandler(UNABLE_TO_ADD_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodoHandler(null);
      });
  };

  const completeAllHandler = () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const activeTodos = todos.filter(({ completed }) => !completed);

    setErrorHandler('');

    if (areAllTodosCompleted) {
      completedTodos.forEach(({ title, completed, id }) => {
        setUpdatingTodosIdsHandler(id);

        updateTodoApi(id, { title, completed: !completed })
          .then(() => updateTodoHandler({ title, completed: !completed, id }))
          .catch(() => {
            setErrorHandler(UNABLE_TO_UPDATE_ERROR);
          })
          .finally(() => setUpdatingTodosIdsHandler(null));
      });
    } else {
      activeTodos.forEach(({ title, completed, id }) => {
        setUpdatingTodosIdsHandler(id);

        updateTodoApi(id, { title, completed: !completed })
          .then(() => updateTodoHandler({ title, completed: !completed, id }))
          .catch(() => {
            setErrorHandler(UNABLE_TO_UPDATE_ERROR);
          })
          .finally(() => setUpdatingTodosIdsHandler(null));
      });
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: areAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={completeAllHandler}
      />
      <form onSubmit={submitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleInput}
          disabled={isLoading}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
