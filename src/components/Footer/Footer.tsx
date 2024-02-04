import React from 'react';

import ClearButton from '../ClearButton';
import TodosCounter from '../TodosCounter';
import Filters from '../Filters';

export const Footer:React.FC = () => {
  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <TodosCounter />

      <Filters />

      <ClearButton />
    </footer>
  );
};
