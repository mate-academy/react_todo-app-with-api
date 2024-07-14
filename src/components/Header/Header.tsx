import React, { Dispatch, FormEvent, SetStateAction } from 'react';
import cn from 'classnames';

interface Props {
  hasTodos: boolean;
  addTodo: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  toggleAll: () => void;
  isToggleVisible: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  hasTodos,
  addTodo,
  title,
  setTitle,
  toggleAll,
  isToggleVisible,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isToggleVisible })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};

Header.displayName = 'header';
