import { useEffect, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import cl from 'classnames';

type Props = {
  inputValue: string;
  todoInputRef: React.RefObject<HTMLInputElement>;
  activeToogle: boolean;
  hasTodos: boolean;
  changeError: (newErrorText: ErrorMessage | '') => void;
  onInputChange: (value: string) => void;
  onAddTodo: (title: string) => Promise<void>;
  onToogleAll: () => void;
};

export const TodoappHeader: React.FC<Props> = ({
  inputValue,
  todoInputRef,
  activeToogle,
  hasTodos,
  changeError,
  onInputChange,
  onAddTodo,
  onToogleAll,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isLoading, todoInputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedValue = inputValue.trim();

    if (normalizedValue === '') {
      changeError(ErrorMessage.EmptyTitle);

      return;
    }

    changeError('');

    setIsLoading(true);
    onAddTodo(normalizedValue)
      .then(() => onInputChange(''))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cl('todoapp__toggle-all', { active: activeToogle })}
          data-cy="ToggleAllButton"
          onClick={onToogleAll}
        />
      )}

      <form onSubmit={e => handleSubmit(e)}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => onInputChange(event.currentTarget.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
