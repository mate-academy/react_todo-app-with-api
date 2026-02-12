import React from 'react';

type Props = {
  allComplete: boolean;
  newTodoRef: React.RefObject<HTMLInputElement>;
  newTitle: string;
  onTitleChange: (value: string) => void;
  onSubmit: () => void;
  isAdding: boolean;
  onToggleAll: () => void;
  loadingIds: number[];
  totalTodos: number;
};

export const Header: React.FC<Props> = ({
  allComplete,
  newTodoRef,
  newTitle,
  onTitleChange,
  onSubmit,
  isAdding,
  onToggleAll,
  loadingIds,
  totalTodos,
}) => {
  //#region handles
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  //#endregion

  return (
    <header className="todoapp__header">
      {totalTodos > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allComplete ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
          disabled={loadingIds.length > 0}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
