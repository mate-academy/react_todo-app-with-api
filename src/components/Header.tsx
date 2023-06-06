import React from 'react';

interface HeaderProps {
  toggleAllTodos: () => void;
  error: string | null;
}

const Header: React.FC<HeaderProps> = ({ toggleAllTodos, error }) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Switch-all"
        onClick={toggleAllTodos}
      />
      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            aria-label="remove"
          />
          Unable to update a todo
        </div>
      )}
    </header>
  );
};

export default Header;
