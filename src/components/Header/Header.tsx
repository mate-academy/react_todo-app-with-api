import classNames from 'classnames';
import { Todo } from '../../types/types';

type Props = {
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  setInputTitle: (value: string) => void;
  inputTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => void;
  active: Todo | undefined;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  addTodo,
  inputTitle,
  setInputTitle,
  inputRef,
  toggleAll,
  active,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: !active })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={e => setInputTitle(e.target.value)}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
