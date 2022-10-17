/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  addTodo: (event: FormEvent) => Promise<void>;
  toggleAll: () => void;
  title: string;
  setTitle: (value: string) => void;
  isLoading: boolean;
  toggleLoader: boolean;
  isFocused: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  toggleAll,
  title,
  setTitle,
  isLoading,
  toggleLoader,
  isFocused,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoField.current?.focus();
  }, [isFocused]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: todos.every(todo => todo.completed) },
          )}
          onClick={toggleAll}
          disabled={toggleLoader}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
