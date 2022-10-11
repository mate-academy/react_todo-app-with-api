import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  leftTodosLength: number;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  setError: (error: Errors) => void;
  onAdd: (todoTitle: string) => Promise<void>;
  toggleAllTodos: () => void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  setError,
  onAdd,
  isAdding,
  toggleAllTodos,
  leftTodosLength,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setError(Errors.TITLE);

      return;
    }

    onAdd(newTodoTitle).finally(() => setNewTodoTitle(''));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="toggle-all-button"
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: leftTodosLength === 0 },
          )}
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          value={newTodoTitle}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
