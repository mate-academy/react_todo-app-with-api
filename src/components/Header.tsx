import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  titleInput: string;
  setTitleInput: (title: string) => void;
  handleCreateTodo: (title: string) => void;
  isLoading: boolean;
  onToggleAll: () => void;
  todos: Todo[];
  tempTodo: Todo | null;
}

export const Header: React.FC<Props> = ({
  titleInput,
  setTitleInput,
  handleCreateTodo,
  isLoading,
  onToggleAll,
  todos,
  tempTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreateTodo(titleInput);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleInput}
          onChange={e => setTitleInput(e.target.value)}
          autoFocus
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
