import { Todo } from '../types/Todo';

type PropsForm = {
  focusRef: React.RefObject<HTMLInputElement>;
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  handleToggleAll: () => void;
  isDisabled: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
};

export const TodoForm: React.FC<PropsForm> = ({
  focusRef,
  handleAdd,
  handleToggleAll,
  isDisabled,
  title,
  setTitle,
  todos,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const hasTodos = todos.length > 0;

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          onClick={handleToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusRef}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
