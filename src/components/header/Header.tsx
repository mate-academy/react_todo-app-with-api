import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { appContext } from '../Context/Context';
import { Error } from '../../types/TypeOfErrors';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    setErrors,
    addTodoTitle,
    USER_ID,
    setIsLoading,
    isLoading,
    toggleAllToCompletedTodos,
  } = useContext(appContext);

  const inputRef = useRef<null | HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!query.trim()) {
      setErrors(Error.CorrectTitle);

      return;
    }

    addTodoTitle({
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    }).then(() => setQuery(''))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const activeButt = () => {
    return todos.length > 0 && todos.every(todo => todo.completed);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="ToggleAllButton"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeButt(),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllToCompletedTodos}
        />
      )}

      <form onSubmit={handleOnSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isLoading}
          onChange={(event) => setQuery(event.target.value)}
          value={query}
        />
      </form>
    </header>
  );
};
