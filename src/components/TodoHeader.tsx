import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  newTodoInput: string;
  setNewTodoInput: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  loadingIds: number[];
  handleSwitchTodos: (handleType: string) => void;
  shouldFocus: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  newTodoInput,
  setNewTodoInput,
  addTodo,
  isLoading,
  loadingIds,
  handleSwitchTodos,
  shouldFocus,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (activeTodos.length === 0) {
      handleSwitchTodos('makeAllActive');
    } else {
      handleSwitchTodos('makeAllCompleted');
    }
  };

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus, loadingIds, isLoading]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleClick()}
        />
      )}

      <form
        onSubmit={event => {
          addTodo(event);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoInput}
          onChange={event => setNewTodoInput(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
