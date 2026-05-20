import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  onAddTodo: React.FormEventHandler<HTMLFormElement>;
  isSending: boolean;
  newTodoInput: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  completedTodos: Todo[];
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todosLength,
  onAddTodo,
  isSending,
  newTodoInput,
  newTodoTitle,
  setNewTodoTitle,
  completedTodos,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          onClick={onToggleAll}
          type="button"
          className={classNames(
            'todoapp__toggle-all',

            completedTodos.length > 0 &&
              completedTodos.length === todosLength &&
              'active',
          )}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          disabled={isSending}
          ref={newTodoInput}
          value={newTodoTitle}
          onChange={e => {
            setNewTodoTitle(e.target.value);
          }}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
