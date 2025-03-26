import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../../types/Loader';
import classNames from 'classnames';

type Props = {
  onTitle: (value: string) => void;
  todos: Todo[] | [];
  loader: Loader;
  error: string;
  changeCompleted: (todos: Todo) => void;
  changeCompletedIds: (id: number[]) => void;
};

export const Header: React.FC<Props> = ({
  onTitle,
  todos,
  loader,
  error,
  changeCompleted,
  changeCompletedIds,
}) => {
  const [query, setQuery] = useState('');
  const [toggleArrow, setToggleArrow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTitle(query.trim());
  };

  const completedTodos = todos.filter(todo => todo.completed === true).length;

  useEffect(() => {
    const statusArrow = completedTodos === todos.length;

    setToggleArrow(statusArrow);
  }, [todos]);

  const updateMultiplyTodos = (updateTodos: Todo[]) => {
    Promise.allSettled(
      updateTodos.map(todo =>
        changeCompleted({ ...todo, completed: !todo.completed }),
      ),
    );
  };

  const handleChangeCompeted = () => {
    const updateTodos = todos.filter(todo => todo.completed === toggleArrow);

    changeCompletedIds(updateTodos.map(todo => todo.id));

    updateMultiplyTodos(updateTodos);
  };

  useEffect(() => {
    if (error.length === 0) {
      setQuery('');
    }

    inputRef.current?.focus();
  }, [error, todos.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: toggleArrow,
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeCompeted}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loader.loading}
        />
      </form>
    </header>
  );
};
