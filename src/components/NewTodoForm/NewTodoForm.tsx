import React, { FC, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { getTodos, sendNewTodo, toggleTodoStatus } from '../../api/todos';
import { AppTodoContext } from '../../contexts/AppTodoContext';
import { ErrorType } from '../Error/Error.types';
import { USER_ID } from '../../react-app-env';

export const NewTodoForm: FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    setErrorMessage,
    setVisibleTodos,
    completedTodos,
    removeProcessingTodo,
    addProcessingTodo,
  } = useContext(AppTodoContext);

  const [inputValue, setInputValue] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const handleInputChange = (value: string) => {
    setErrorMessage(ErrorType.NoError);
    setInputValue(value);
  };

  const handleAddingTodoOnAPI = async (title: string) => {
    setTempTodo({
      id: 0,
      title,
      completed: false,
    });

    setIsInputDisabled(true);

    try {
      const newTodo = await sendNewTodo(inputValue, USER_ID);

      setTodos(await getTodos(USER_ID));
      setVisibleTodos(
        prevTodos => [...prevTodos, newTodo],
      );
    } catch {
      setErrorMessage(ErrorType.NewTodoError);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInputValue('');

    const validatedValue = inputValue.trim();

    if (validatedValue === '') {
      setErrorMessage(ErrorType.InputError);

      return;
    }

    setErrorMessage(ErrorType.NoError);
    handleAddingTodoOnAPI(validatedValue);
  };

  const handleToggleAll = async () => {
    // completedTodos.forEach(({ id }) => );

    completedTodos.forEach(async (completedTodo) => {
      addProcessingTodo(completedTodo.id);

      try {
        await toggleTodoStatus(completedTodo);
      } catch {
        setErrorMessage(ErrorType.UpdateTodoError);
      } finally {
        removeProcessingTodo(completedTodo.id);
      }

      const newTodos = await getTodos(USER_ID);

      setTodos(newTodos);
      setVisibleTodos(newTodos);
    });
  };

  return (
    <>
      <button
        aria-label="toggle all active"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.length === completedTodos.length },
        )}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </>
  );
};
