import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  title: string;
  isAdding: boolean;
  isTodoCompleted: boolean;
  switchTodos: () => void;
  onChange: (query: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    title,
    isAdding,
    isTodoCompleted,
    switchTodos,
    onChange,
    onSubmit,
    newTodoField,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isTodoCompleted },
        )}
        onClick={() => switchTodos()}
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
