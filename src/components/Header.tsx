import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isAllTodosCompleted: boolean;
  onTodoCompleteChange: (todoId: number, completed: boolean) => void;
  inputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAddTodo: () => void;
  onInputChange: (value: string) => void;
  inputValue: string;
};

export const Header: React.FC<Props> = ({
  todos,
  isAllTodosCompleted,
  onTodoCompleteChange,
  inputDisabled,
  onAddTodo,
  inputRef,
  onInputChange,
  inputValue,
}) => {
  function handleAllTodosCompleteChange() {
    const newCompleted = !isAllTodosCompleted;

    todos.forEach(todo => {
      if (todo.completed !== newCompleted) {
        onTodoCompleteChange(todo.id, newCompleted);
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddTodo();
  }

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          onClick={handleAllTodosCompleteChange}
          type="button"
          className={cn('todoapp__toggle-all', isAllTodosCompleted && 'active')}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={inputDisabled}
          onChange={event => onInputChange(event.target.value)}
          value={inputValue}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>
    </header>
  );
};
