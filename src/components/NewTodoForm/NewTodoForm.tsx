import React, { FC, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { getTodos, sendNewTodo, toggleTodoStatus } from '../../api/todos';
import { AppTodoContext } from '../../contexts/AppTodoContext';
import { USER_ID } from '../../react-app-env';
import {ErrorType} from "../../types/enums";

export const NewTodoForm: FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    setErrorMessage,
    completedTodos,
    removeProcessingTodo,
    addProcessingTodo,
  } = useContext(AppTodoContext);

  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

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
      await sendNewTodo(inputValue, USER_ID);

      setTodos(await getTodos(USER_ID));
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
    try {
      await Promise.all(completedTodos.map(async (completedTodo) => {
        addProcessingTodo(completedTodo.id);
        await toggleTodoStatus(completedTodo);
        removeProcessingTodo(completedTodo.id);
      }));

      setTodos(prevTodos => {
        return prevTodos.map(prevTodo => {
          return { ...prevTodo, completed: !prevTodo.completed };
        });
      });
    } catch {
      setErrorMessage(ErrorType.UpdateTodoError);
    }
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
