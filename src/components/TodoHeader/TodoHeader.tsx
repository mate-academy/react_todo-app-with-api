import cn from 'classnames';
import { TodoViewModel } from '../../types/Todo';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  onUpdateTodos: () => Promise<void>;
  onCreateTodo: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  value: string;
  disabled: boolean;
  onChangeValue: (title: string) => void;
  activeTodosCount: number;
  completedTodos: number;
  todos: TodoViewModel[];
};

export function TodoHeader({
  inputRef,
  onUpdateTodos,
  onCreateTodo,
  value,
  disabled,
  onChangeValue,
  activeTodosCount,
  completedTodos,
  todos,
}: Props) {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !activeTodosCount && completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={onUpdateTodos}
        />
      )}

      <form onSubmit={onCreateTodo}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => onChangeValue(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
}
