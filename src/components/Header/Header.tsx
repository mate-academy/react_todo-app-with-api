/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { USER_ID } from '../../constants/UserId';
import { ErrorMessage } from '../../types/ErrorMessage';
import * as TodoClient from '../../api/todos';

export const Header: React.FC = () => {
  const [value, setValue] = useState('');

  const {
    todos,
    tempTodo,
    addTodo,
    updateTodo,
    handleUpdatingTodosIds,
    handleSetTempTodo,
    handleSetErrorMessage,
  } = useContext(TodoContext);

  const newTodoInput = useRef<HTMLInputElement>(null);
  const isCompleteAll = todos.some(({ completed }) => !completed);

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetErrorMessage(ErrorMessage.None);

    const newTodo = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    if (!value.trim()) {
      handleSetErrorMessage(ErrorMessage.Title);

      return;
    }

    newTodoInput.current?.setAttribute('disabled', 'true');
    handleSetTempTodo({ ...newTodo, id: 0 });
    TodoClient.addTodo(newTodo)
      .then(todo => {
        addTodo(todo);
        setValue('');
      })
      .catch(() => handleSetErrorMessage(ErrorMessage.Add))
      .finally(() => {
        newTodoInput.current?.removeAttribute('disabled');
        handleSetTempTodo(null);
      });
  };

  const handleCompleteAllTodos = () => {
    handleSetErrorMessage(ErrorMessage.None);

    todos.forEach(todo => {
      if (todo.completed !== isCompleteAll) {
        handleUpdatingTodosIds(todo.id);

        TodoClient.updateTodo({ ...todo, completed: isCompleteAll })
          .then(() => updateTodo({ ...todo, completed: isCompleteAll }))
          .catch(() => handleSetErrorMessage(ErrorMessage.Update))
          .finally(() => handleUpdatingTodosIds(null));
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !isCompleteAll,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompleteAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
