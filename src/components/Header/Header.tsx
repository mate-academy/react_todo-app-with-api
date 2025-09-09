import classNames from 'classnames';
import { RefObject, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  query: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isDisabled: boolean;
  handleSubmit: (value: React.FormEvent<HTMLFormElement>) => void;
  setQuery: React.Dispatch<SetStateAction<string>>;
  countOfCompletedTodos: () => number;
  allTodos: Todo[];
  handleToggleAll: () => void;
  setIsToggleAll: React.Dispatch<SetStateAction<boolean>>;
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  countOfCompletedTodos,
  query,
  inputRef,
  isDisabled,
  setQuery,
  allTodos,
  handleToggleAll,
  setIsToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active:
              allTodos.length > 0 &&
              countOfCompletedTodos() === allTodos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            setIsToggleAll(true);
            handleToggleAll();
          }}
        />
      )}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={query}
          ref={inputRef}
          disabled={isDisabled}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
