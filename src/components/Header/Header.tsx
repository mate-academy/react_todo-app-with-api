import React from 'react';
import { NewTodo } from '../newTodo';
import cn from 'classnames';

type Props = {
  hasTodos: boolean;
  areAllCompleted: boolean;
  onToggleAll: () => void;
  onAdd: (title: string) => Promise<void>;
  onEmpty: () => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header = React.memo<Props>(
  ({
    hasTodos,
    areAllCompleted,
    onToggleAll,
    onAdd,
    onEmpty,
    isAdding,
    inputRef,
  }) => {
    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}

        {hasTodos && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: areAllCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}
        <NewTodo
          onAdd={onAdd}
          onEmpty={onEmpty}
          isAdding={isAdding}
          inputRef={inputRef}
        />
      </header>
    );
  },
);
Header.displayName = 'Header';
