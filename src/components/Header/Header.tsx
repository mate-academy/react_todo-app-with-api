import React from 'react';
import { NewTodo } from '../NewTodo/NewTodo';

interface HeaderProps {
  hasActiveTodos: boolean,
  newTodo: string,
  inputDisabled: boolean,
  setNewTodo(event: React.ChangeEvent<HTMLInputElement>): void,
  onNewTodoSubmit(event: React.FormEvent<HTMLFormElement>): void,
  onToggleAll(): Promise<void>,
}

/* this buttons is active only if there are some active todos  */
export const Header: React.FC<HeaderProps> = ({
  hasActiveTodos,
  newTodo,
  inputDisabled,
  setNewTodo,
  onNewTodoSubmit,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasActiveTodos && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="button"
          onClick={onToggleAll}
        />
      )}
      <NewTodo
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        inputDisabled={inputDisabled}
        onNewTodoSubmit={onNewTodoSubmit}
      />
    </header>
  );
};
