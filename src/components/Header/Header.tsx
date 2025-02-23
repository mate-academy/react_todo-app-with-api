import { useEffect, useRef, useState } from 'react';
import { addTodo } from '../../utils/addTodo';
import { toggleCompletedTodo } from '../../utils/toggleTodo';
import classNames from 'classnames';
import { HeaderProps } from '../../types/HeaderProps';

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setTempTodo,
  error,
  setError,
  isLoadingIds,
  setIsLoadingIds,
}) => {
  const [inputValue, setInputValue] = useState('');

  const titleInput = useRef<HTMLInputElement>(null);
  const isCompletedAll = todos.every(todo => todo.completed);

  useEffect(() => {
    titleInput.current?.focus();
  }, [todos, error]);

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();

    addTodo(
      inputValue,
      setError,
      setTempTodo,
      setTodos,
      setInputValue,
      setIsLoadingIds,
    );
  }

  const completeAllTodo = () => {
    const todosToUpdate = isCompletedAll
      ? todos
      : todos.filter(todo => !todo.completed);

    const idsToLoad = todosToUpdate.map(todo => todo.id);

    setIsLoadingIds(currentIds => [...currentIds, ...idsToLoad]);

    setTimeout(() => {
      Promise.all(
        todosToUpdate.map(todo => {
          return toggleCompletedTodo(todo, setIsLoadingIds, setTodos, setError);
        }),
      ).finally(() => {
        setIsLoadingIds([]);
      });
    }, 300);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isCompletedAll,
          })}
          data-cy="ToggleAllButton"
          onClick={completeAllTodo}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={titleInput}
          disabled={isLoadingIds.length > 0}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
