import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  title: string;
  isAdding: boolean;
  isEachTodoCompleted: boolean;
  newTodoField: React.RefObject<HTMLInputElement>
  onChange: (query: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  toggleAllTodosStatus: () => void;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    title,
    isAdding,
    newTodoField,
    isEachTodoCompleted,
    onChange,
    onSubmit,
    toggleAllTodosStatus,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isEachTodoCompleted },
        )}
        onClick={() => toggleAllTodosStatus()}
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event) => onChange(event.target.value)}
        />
      </form>
    </header>
  );
});
