import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  titleField: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleSubmit,
  handleInput,
  titleField,
  todoTitle,
  loading,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: !todos.find(todo => todo.completed === false),
          })}
          onClick={() => {
            toggleAll();
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={todoTitle}
          onChange={handleInput}
          disabled={loading}
        />
      </form>
    </header>
  );
};
