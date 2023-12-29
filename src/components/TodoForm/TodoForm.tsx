import React, { useContext, useState } from 'react';
import classNames from 'classnames';

import { TodoContext } from '../TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const TodoForm = () => {
  const {
    addTodo,
    loading,
    setIsLoadingAll,
    USER_ID,
    setErrorMessage,
    todos,
    updateTodo,
  } = useContext(TodoContext);

  const [inputValue, setInputValue] = useState('');
  const isDisabled = loading !== null;
  const completedTodos = todos.filter(todo => todo.completed);
  const isAllCompleted = completedTodos.length === todos.length;

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim().length) {
      addTodo({
        id: Math.random(),
        title: inputValue,
        completed: false,
        userId: USER_ID,
      });
    } else {
      setErrorMessage(ErrorMessage.EmptyTitle);
    }

    setInputValue('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const handleToggleAll = () => {
    setIsLoadingAll(true);
    todos.forEach((todo) => {
      updateTodo({
        ...todo,
        completed: !isAllCompleted,
      });
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: isAllCompleted })}
        data-cy="ToggleAllButton"
        aria-label="Show active todo"
        onClick={handleToggleAll}
      />
      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
