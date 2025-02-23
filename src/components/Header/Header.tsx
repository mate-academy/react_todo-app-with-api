import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  completedTodos: Todo[];
  toggleAllTodos: () => void;
  handleSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export const Header: React.FC<Props> = ({
  todos,
  completedTodos,
  toggleAllTodos,
  handleSubmit,
  inputRef,
  todoTitle,
  handleTitleChange,
  isSubmitting,
}) => {
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
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
