import React from 'react';

interface HeaderProps {
  toggleAllTodos: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleAllTodos }) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all"
        aria-label="Switch-all"
        onClick={toggleAllTodos}
      />
    </header>
  );
};

export default Header;
