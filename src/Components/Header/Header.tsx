import { FormEventHandler, useEffect, useRef } from 'react';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  todos: Todo[];
  errorType: ErrorType;
  handleSubmit: FormEventHandler;
  tempTodo: Todo | null;
  toggleAllToCompleted: () => void;
  isLoading: number[];
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  todos,
  errorType,
  handleSubmit,
  tempTodo,
  toggleAllToCompleted,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, errorType]);

  const completedTodos = todos.filter(todo => todo.completed);

  const toggleButtonClassName = classNames('todoapp__toggle-all', {
    active:
      todos.length > 0 &&
      isLoading.length === 0 &&
      completedTodos.length === todos.length &&
      toggleAllToCompleted,
  });

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          onClick={toggleAllToCompleted}
          type="button"
          className={toggleButtonClassName}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={tempTodo !== null}
          value={newTodoTitle}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
