import React, { useEffect } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';
import classNames from 'classnames';

type Props = {
  todosCount: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  addTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAllTodos: () => Promise<void>;
  allCompleted: boolean;
};

export const NewTodoInput: React.FC<Props> = ({
  todosCount,
  setErrorMessage,
  addTodo,
  handleAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  loading,
  setIsLoading,
  toggleAllTodos,
  allCompleted,
}) => {
  const resetFocus = () => {
    inputRef.current?.focus();
  };

  const showError = (error: ErrorTypes) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const saveTodo = async () => {
    const trimmedValue = newTodoTitle.trim();

    if (!trimmedValue) {
      showError(ErrorTypes.EMPTY_TITLE);
      resetFocus();

      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await handleAddTodo(trimmedValue);
      setTimeout(() => resetFocus(), 0);
    } catch (error) {
      showError(ErrorTypes.ADD_TODO_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addTodo) {
      await saveTodo();
      resetFocus();
    }
  };

  const handleBlur = async () => {
    if (!addTodo && newTodoTitle.trim()) {
      await saveTodo();
    }
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTodoTitle('');
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleEscKey);

    return () => {
      window.removeEventListener('keyup', handleEscKey);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      {todosCount > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
            completed: allCompleted,
          })}
          onClick={toggleAllTodos}
          disabled={loading}
        ></button>
      )}

      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleInputChange}
        onBlur={handleBlur}
        ref={inputRef}
        disabled={loading}
      />
    </form>
  );
};
