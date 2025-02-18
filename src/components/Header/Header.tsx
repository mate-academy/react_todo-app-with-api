import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';
import * as todoService from '../../api/todos';
import { TodoHelpers } from '../../types/TodoHelpers';

type HeaderProps = {
  counterCompletedTodos: number;
  addTodo: (
    helpers: TodoHelpers,
    { title, userId, completed }: Omit<Todo, 'id'>,
  ) => Promise<void>;
  completeAllTodo: (helpers: TodoHelpers) => void;
  helpers: TodoHelpers;
  isSubmitting: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  counterCompletedTodos,
  addTodo,
  completeAllTodo,
  helpers,
  isSubmitting,
}) => {
  const [query, setQuery] = useState('');

  const { todos, inputRef, timerId, setErrorMessage, closeError } = helpers;

  const handleQueryChanged = (newValue: string) => {
    setQuery(newValue);
  };

  const reset = () => {
    setQuery('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage('');
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
      closeError();

      return;
    }

    addTodo(helpers, {
      title: query.trim(),
      userId: todoService.USER_ID,
      completed: false,
    })
      .then(reset)
      .catch(error => {
        window.clearTimeout(timerId.current);
        closeError();
        throw error;
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: counterCompletedTodos === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={() => completeAllTodo(helpers)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={event => {
            handleQueryChanged(event.target.value);
          }}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
