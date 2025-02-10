import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  addNewTodo: (title: string) => void;
  title: string;
  setTitle: (value: string) => void;
  todos: Todo[];
  isLoading: boolean;
  handleAllChangeStatus: (todos: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  addNewTodo,
  title,
  setTitle,
  todos,
  isLoading,
  handleAllChangeStatus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, todos]);

  const handleTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewTodo(title);
  };

  const isAllCompleteTodos = todos.every((todo: Todo) => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleteTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleAllChangeStatus(todos)}
        />
      )}
      <form onSubmit={handleTitleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
