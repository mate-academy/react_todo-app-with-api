import classNames from 'classnames';
import React from 'react';
import { NewTodoField } from '../NewTodo';

interface Props {
  allCompleted: boolean;
  loading: boolean;
  hasTodos: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onError: (error: string) => void;
  addTodo: (title: string) => Promise<void>;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  allCompleted,
  loading,
  inputRef,
  hasTodos,
  onError,
  addTodo,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <NewTodoField
        loading={loading}
        inputRef={inputRef}
        onError={onError}
        addTodo={addTodo}
      />
    </header>
  );
};
