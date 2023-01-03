/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  query: string;
  isDisabledInput: boolean;
  toggleButton?: boolean;
  onQueryChange: (value: string) => void;
  onErrorChange: (value: ErrorType) => void;
  onAddNewTodo: (value: Todo) => void;
  onToggleChange: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  query,
  isDisabledInput,
  toggleButton,
  onQueryChange,
  onErrorChange,
  onAddNewTodo,
  onToggleChange,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDisabledInput]);

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim().length) {
      onErrorChange(ErrorType.Title);

      setTimeout(() => {
        onErrorChange(ErrorType.None);
      }, 3000);

      return;
    }

    if (user) {
      onAddNewTodo({
        id: 0,
        userId: user.id,
        title: query,
        completed: false,
      });
    }

    onQueryChange('');
  }, [query]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn(
            'todoapp__toggle-all',
            {
              active: toggleButton,
            },
          )}
          onClick={() => onToggleChange()}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          disabled={isDisabledInput}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
};
