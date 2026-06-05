import React from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number;
  hasTempTodo: boolean;
  isAllCompleted: boolean;
  handleToggleAll: () => void;

  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;

  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todosLength,
  hasTempTodo,
  isAllCompleted,
  handleToggleAll,
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  inputRef,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      {(todosLength > 0 || hasTempTodo) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
