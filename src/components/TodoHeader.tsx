/* eslint-disable no-useless-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorsMessage } from '../types/ErrorsMessage';
import { USER_ID } from '../constants/User';
import * as TodoClient from '../api/todos';
import classNames from 'classnames';

export const TodoHeader = () => {
  const [taskValue, setTaskValue] = useState('');

  const {
    todos,
    tempTodo,
    addTodo,
    updateTodo,
    handleSetTempTodo,
    handleSetErrorMessage,
    handleUpdatingTodosIds,
  } = useContext(TodoContext);

  const newTaskInput = useRef<HTMLInputElement>(null);
  const completedAllTasks = todos.some(({ completed }) => !completed);

  const handleSetTaskValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetErrorMessage(ErrorsMessage.None);

    const newTask = {
      userId: USER_ID,
      title: taskValue.trim(),
      completed: false,
    };

    if (!taskValue.trim()) {
      handleSetErrorMessage(ErrorsMessage.Title);

      return;
    }

    newTaskInput.current?.setAttribute('disabled', 'true');

    handleSetTempTodo({ ...newTask, id: 0 });

    TodoClient.addTodo(newTask)
      .then(todo => {
        addTodo(todo);
        setTaskValue('');
      })
      .catch(() => handleSetErrorMessage(ErrorsMessage.Add))
      .finally(() => {
        newTaskInput.current?.removeAttribute('disabled');
        handleSetTempTodo(null);
      });
  };

  const handleChangeCompleteAll = () => {
    handleSetErrorMessage(ErrorsMessage.None);

    todos.forEach(todo => {
      if (todo.completed !== completedAllTasks) {
        handleUpdatingTodosIds(todo.id);

        TodoClient.updateTodo({ ...todo, completed: completedAllTasks })
          .then(() => updateTodo({ ...todo, completed: completedAllTasks }))
          .catch(() => handleSetErrorMessage(ErrorsMessage.Update))
          .finally(() => handleUpdatingTodosIds(null));
      }
    });
  };

  useEffect(() => {
    newTaskInput.current?.focus();
  }, [todos.length, tempTodo]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !completedAllTasks,
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeCompleteAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTaskInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={taskValue}
          onChange={event => handleSetTaskValue(event)}
        />
      </form>
    </header>
  );
};
