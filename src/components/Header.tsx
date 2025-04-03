import { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  createTodo: (value: string) => void;
  isLoading: boolean;
  handleToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  shouldFocusCreationForm: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  setNewTodoTitle,
  createTodo,
  isLoading,
  handleToggleTodo,
  shouldFocusCreationForm,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isAllCompleted = todos.every(todo => todo.completed);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      inputRef.current?.focus();
    }

    createTodo(newTodoTitle);
  };

  const onAllToggle = (todosToToggle: Todo[]) => {
    todosToToggle
      .filter(todo => todo.completed === isAllCompleted)
      .forEach(todo => handleToggleTodo(todo.id, !isAllCompleted));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [shouldFocusCreationForm]);

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onAllToggle(todos)}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => {
            setNewTodoTitle(event.target.value);
          }}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
