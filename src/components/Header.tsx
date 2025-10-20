import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { handleToggleAll } from '../utils/handleToggleAll';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setDeletingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  newTitle: string;
  setNewTitle: (title: string) => void;
  isAdding: boolean;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setDeletingTodoIds,
  newTitle,
  setNewTitle,
  isAdding,
  onSubmit,
  inputRef,
}) => {
  const hasTodos = todos.length > 0;
  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() =>
            handleToggleAll({
              todos,
              setTodos,
              setErrorMessage,
              setDeletingTodoIds,
            })
          }
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
