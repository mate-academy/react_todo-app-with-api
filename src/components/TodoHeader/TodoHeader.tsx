import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  isLoading: boolean;
  todos: Todo[];
  completedTodosCount: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  onAdd: () => void;
  onToggleAll: () => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  showError: (msg: ErrorMessage) => void;
};

export const TodoHeader: React.FC<Props> = ({
  isLoading,
  todos,
  completedTodosCount,
  inputValue,
  setInputValue,
  onAdd,
  onToggleAll,
  newTodoField,
  isAdding,
  showError,
}) => (
  <header className="todoapp__header">
    {!isLoading && todos.length > 0 && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completedTodosCount === todos.length,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form
      onSubmit={e => {
        e.preventDefault();
        const title = newTodoField.current?.value.trim();

        if (!title) {
          showError(ErrorMessage.Empty);

          return;
        }

        onAdd();
      }}
    >
      <input
        ref={newTodoField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        disabled={isAdding}
      />
    </form>
  </header>
);
