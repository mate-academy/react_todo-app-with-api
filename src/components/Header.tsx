import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTodo: string;
  setNewTodo: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  handleToggleAll: () => void;
};

export const Header = ({
  todos,
  newTodo,
  setNewTodo,
  inputRef,
  isAdding,
  handleSubmit,
  handleToggleAll,
}: Props) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${
          todos.every(todo => todo.completed) ? 'active' : ''
        }`}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />
    )}

    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={event => setNewTodo(event.target.value)}
        ref={inputRef}
        disabled={isAdding}
      />
    </form>
  </header>
);
