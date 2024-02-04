import React from 'react';
import NewTodoField from '../NewTodoField';
import ToggleAllButton from '../ToggleAllButton';

export const Header: React.FC = () => {
  return (
    <header className="todoapp__header">
      <ToggleAllButton />

      <NewTodoField />
    </header>
  );
};
