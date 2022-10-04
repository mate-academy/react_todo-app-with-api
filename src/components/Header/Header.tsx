import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  isAdding: boolean;
  leftTodosLength: number;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  setError: (error: Errors) => void;
  onAdd: (todoTitle: string) => Promise<void>;
  toggleAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  todos,
  setError,
  onAdd,
  isAdding,
  toggleAllTodos,
  leftTodosLength,
  newTodoTitle,
  setNewTodoTitle,
}) => {
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
