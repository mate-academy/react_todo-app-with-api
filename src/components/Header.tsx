/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

interface Props {
  userId: number,
  inputText: string;
  active: Todo[];
  setInputText: (str: string) => void;
  isLoading: boolean;
  setIsLoading: (arg: boolean) => void;
  setError: (message: Errors | '') => void;
  handleAdd: (todo: Omit<Todo, 'id'>) => void;
  toggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  userId,
  inputText,
  active,
  setInputText,
  setError,
  handleAdd,
  isLoading,
  setIsLoading,
  toggleAll,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedInput = inputText.trim();

    if (normalizedInput) {
      const newTodo = {
        title: normalizedInput,
        userId,
        completed: false,
      };

      setIsLoading(true);
      handleAdd(newTodo);
    } else {
      setError(Errors.EmptyTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {true && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: active.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          disabled={isLoading}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </form>
    </header>
  );
};
