/* eslint-disable jsx-a11y/control-has-associated-label */
import { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useAppContext } from '../AppProvider';

export const Header = () => {
  const {
    addTempTodo,
    setTodosToToggle,
    todos,
    activeTodos,
  } = useAppContext();

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    [setTitle],
  );

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim()) {
      setIsLoading(true);
      addTempTodo(title.trim()).finally(() => {
        setIsLoading(false);
      });
      setTitle('');
    }
  };

  const handleCompleteAll = () => {
    setTodosToToggle(
      activeTodos.length
        ? activeTodos
        : [...todos],
    );
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodos.length },
        )}
        onClick={handleCompleteAll}
      />

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
