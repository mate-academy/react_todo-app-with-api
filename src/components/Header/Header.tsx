import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (title: string) => void;
  title: string;
  setTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDisabled: boolean;
  isLoadingTodo: boolean;
  toggleAllTodos: () => void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  inputRef,
  addTodo,
  title,
  setTitle,
  isDisabled,
  isLoadingTodo,
  toggleAllTodos,
  todos,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={isDisabled || isLoadingTodo}
        />
      </form>
    </header>
  );
};
