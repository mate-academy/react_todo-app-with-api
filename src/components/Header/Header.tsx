import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { useNewTodoForm } from '../../hooks/useNewTodoForm';

type Props = {
  todoList: Todo[];
  onError: (value: ErrorMessage | '') => void;
  onAdd: (title: string) => Promise<void>;
  isDisabled: boolean;
  isAllCompleted: boolean;
  onToggleAllStatus: () => void;
};

export const Header: React.FC<Props> = ({
  todoList,
  onError,
  onAdd,
  isDisabled,
  isAllCompleted,
  onToggleAllStatus,
}) => {
  const { handleSubmit, title, setTitle, inputRef } = useNewTodoForm({
    onError,
    onAdd,
    isDisabled,
    todoList,
  });

  return (
    <header className="todoapp__header">
      {todoList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllStatus}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
