import { useEffect, useState } from 'react';
import { ErrorType } from '../types/ErrorType';
import cn from 'classnames';

type Props = {
  onAddTodo: (todoTitle: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType>>;
  onToggleAll: () => void;
  todosLength: number;
  inputNameRef: React.RefObject<HTMLInputElement> | null;
  isInputDisabled: boolean;
  allTodosAreCompleted: boolean;
};

export const Header: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    onToggleAll,
    todosLength,
    inputNameRef,
    isInputDisabled,
    allTodosAreCompleted,
  } = props;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputNameRef?.current) {
      inputNameRef?.current.focus();
    }

    if (!isInputDisabled) {
      inputNameRef?.current?.focus();
    }
  }, [todosLength, isInputDisabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {
    } finally {
      inputNameRef?.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isInputDisabled}
          ref={inputNameRef}
        />
      </form>
    </header>
  );
};
