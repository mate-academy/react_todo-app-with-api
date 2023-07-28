import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  showError: (text: string) => void;
  todos: Todo[];
  activeTodos: number;
  createTodo: (data: Omit<Todo, 'id'>) => void;
  handlerToggler: () => void;
  setUpdateLoadingState: (s: boolean) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  activeTodos,
  showError,
  createTodo,
  handlerToggler,
  setUpdateLoadingState,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<EventTarget>): void => {
    e.preventDefault();
    setUpdateLoadingState(true);

    if (!query.trim().length) {
      showError("Title can't be empty");
      setQuery('');
      setUpdateLoadingState(false);

      return;
    }

    createTodo({
      title: query,
      completed: false,
      userId: 0,
    });
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="todo comleted"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodos,
          })}
          onClick={handlerToggler}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </header>
  );
};
