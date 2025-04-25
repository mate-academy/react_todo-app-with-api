import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import classNames from 'classnames';

interface Props {
  isLoading: boolean;
  hasCompletedTodos: boolean;
  availableToggelAll: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setErrorMessage: (value: ErrorType) => void;
  addTodo: (value: Todo) => Promise<void>;
  toggleAll: () => void;
}

export const TodoForm: React.FC<Props> = ({
  isLoading,
  hasCompletedTodos,
  availableToggelAll,
  inputRef,
  setErrorMessage,
  addTodo,
  toggleAll,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorType.TITLE);

      setTimeout(() => {
        setErrorMessage(ErrorType.DEFAULT);
      }, 3000);

      return;
    }

    setErrorMessage(ErrorType.DEFAULT);

    addTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(() => setTitle(''))
      .catch(error => {
        setErrorMessage(ErrorType.ADD);
        setTimeout(() => setErrorMessage(ErrorType.DEFAULT), 3000);

        throw error;
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}

      {availableToggelAll && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: hasCompletedTodos,
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
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
