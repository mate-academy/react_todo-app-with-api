import { useEffect, useRef } from 'react';
import { USER_ID } from '../api/todos';

import classNames from 'classnames';

type Props = {
  isInput: string;
  setIsInput: React.Dispatch<React.SetStateAction<string>>;
  createTodo: (userId: number, title: string, completed: boolean) => void;
  setErrorType: (errorType: string | null) => void;
  handleError: (errorType: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};
export const TodoHeader: React.FC<Props> = ({
  isInput,
  setIsInput,
  createTodo,
  setErrorType,
  handleError,
  isLoading,
  setIsLoading,
  handleUpdateAllTodos,
  todos,
}) => {
  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [createTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isInput.trim() === '') {
      handleError('Title should not be empty');

      return;
    }

    setIsLoading(true);
    createTodo(USER_ID, isInput.trim(), false)
      .then(() => {
        setIsInput('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleToggleAll = () => {
    if (todos.length === 0) {
      return;
    }

    const areAllCompleted = todos.every(todo => todo.completed);

    handleUpdateAllTodos(todos, !areAllCompleted);
  };

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted && !isLoading,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          hidden={isLoading}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          ref={titleFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={isInput}
          onChange={event => {
            setIsInput(event.target.value);
            setErrorType(null);
          }}
        />
      </form>
    </header>
  );
};
