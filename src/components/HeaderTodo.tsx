import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  handlerSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleToggleAll: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isAdding: boolean;
  todos: Todo[];
};

export const HeaderTodo = ({
  handlerSubmit,
  handleToggleAll,
  inputRef,
  newTodoTitle,
  setNewTodoTitle,
  isAdding,
  todos,
}: Props) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handlerSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
