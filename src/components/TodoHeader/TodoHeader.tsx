import cn from 'classnames';
import { useState, useContext } from 'react';
import { TodosContext } from '../../TodosContext';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    todoAdd,
    isEveryTodoCompleted,
    setTempTodo,
    toggleAllToStatus,
    setErrorMessage,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isButtonActive = isEveryTodoCompleted();

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!query.trim()) {
      setIsLoading(false);
      setErrorMessage('Title can\'t be empty!');

      setQuery('');

      return;
    }

    todoAdd(query)
      .catch()
      .finally(() => {
        setIsLoading(false);
        setQuery('');
        setTempTodo(null);
      });
  };

  const handleToggleAll = () => {
    toggleAllToStatus(!isButtonActive);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            type="button"
            aria-label="close-button"
            className={cn('todoapp__toggle-all', {
              active: isButtonActive,
            })}
            onClick={handleToggleAll}
          />
        )}

      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.currentTarget.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
