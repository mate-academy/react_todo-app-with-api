import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, RefObject } from 'react';

interface PropsTodoHeader {
  newTodoTitle: string;
  isAdding: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onNewTodoTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
  areAllCompleted: boolean;
  hasTodos: boolean;
  isLoading: boolean;
}

export const TodoHeader: React.FC<PropsTodoHeader> = ({
  newTodoTitle,
  isAdding,
  inputRef,
  onNewTodoTitleChange,
  onSubmit,
  onToggleAll,
  areAllCompleted,
  hasTodos,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && !isLoading && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onNewTodoTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
