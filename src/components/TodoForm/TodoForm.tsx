import classNames from 'classnames';
import React, {
  useRef,
  useContext,
  useEffect,
} from 'react';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  query: string;
  toggleButton?: boolean;
  onQueryChange: (value: string) => void;
  onErrorChange: (value: Error) => void;
  onAddNewTodo: (value: Todo) => void;
  onToggleChange: () => void;
  isDisabledInput: boolean;
};

export const TodoForm: React.FC<Props> = ({
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

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.trim().length === 0) {
      onErrorChange(Error.Title);

      setTimeout(() => {
        onErrorChange(Error.None);
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
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="ToggleAllButton"
          className={classNames(
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
