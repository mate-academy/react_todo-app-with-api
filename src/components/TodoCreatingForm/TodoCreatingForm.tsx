import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTodos } from '../TodosProvider';
import { errorMessages } from '../ErrorNotification';
import * as todoService from '../../api/todos';

export const TodoCreatingForm: React.FC = () => {
  const {
    newTodoTitle,
    setNewTodoTitle,
    createNewTodo,
    setErrorMessage,
    tempTodo,
    todos,
    isLoading,
    updateTodo,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedTodo = newTodoTitle.trim();

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodoTitle(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedTodo) {
      setErrorMessage(errorMessages.titleShouldNotBeEmpty);

      return;
    }

    try {
      createNewTodo(trimmedTodo);
    } catch (error) {
      setErrorMessage(errorMessages.unableToAddTodo);
    }
  };

  const allTodoCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    try {
      const notCompletedTodos = todos.filter(todo => !todo.completed);

      if (notCompletedTodos.length > 0) {
        await Promise.all(
          notCompletedTodos.map(todo =>
            updateTodo({
              ...todo,
              completed: true,
            }),
          ),
        );
      } else {
        const isNewTodoNotCompleted = todos.some(
          todo => todo.id === todoService.USER_ID && !todo.completed,
        );

        if (!isNewTodoNotCompleted) {
          const updatedTodos = todos.map(todo => ({
            ...todo,
            completed: !todo.completed,
          }));

          await Promise.all(updatedTodos.map(updateTodo));
        }
      }
    } catch (error) {
      setErrorMessage(errorMessages.unableToUpdateTodo);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit} autoFocus>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
