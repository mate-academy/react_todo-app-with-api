import React from 'react';
import { ClearButton } from './ClearButton';
import { Filter } from './Filter';
import { TodoCount } from './TodoCount';

export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="todoapp__footer">
      <TodoCount />
      <Filter />
      <ClearButton />
    </footer>
  );
});
