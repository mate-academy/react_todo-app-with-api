import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Error } from '../types/Error';
import { Todo } from '../types/Todo';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<Error | null>>;
  isInputDisabled: boolean;
  todos: Todo[];
  onToggleAll: () => Promise<void>;
  areAllCompletedTodo: boolean;
};
export const TodoHeader: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    isInputDisabled,
    todos,
    onToggleAll,
    areAllCompletedTodo,
  } = props;

  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = inputValue.trim();

    if (normalizedTitle === '') {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(normalizedTitle);
      setInputValue('');
    } catch (err) {}
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllCompletedTodo,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
