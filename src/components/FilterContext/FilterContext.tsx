import React, { useCallback, useState } from 'react';
import { Sort } from '../../types/enums/Sort';
import { Todo } from '../../types/Todo';

type Props = {
  children: React.ReactNode;
};

type Context = {
  filterBy: Sort,
  changeFilterBy: (newStatus: string) => void,
  filterTodo: (todo: Todo) => boolean,
};

export const FilterContext = React.createContext<Context>({
  filterBy: Sort.ALL,
  changeFilterBy: () => {},
  filterTodo: () => false,
});

export const FilterProvider: React.FC<Props> = ({ children }) => {
  const [filterBy, setFilterBy] = useState<Sort>(Sort.ALL); // sort type

  // change sort type
  const changeFilterBy = useCallback((status: string) => {
    const newStatus = status as Sort;

    setFilterBy(() => newStatus);
  }, []);

  // filter todo by Sort type
  const filterTodo = useCallback((todo: Todo) => {
    switch (filterBy) {
      case Sort.ACTIVE:
        return !todo.completed;

      case Sort.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  }, [filterBy]);

  const contextValue = {
    filterBy,
    changeFilterBy,
    filterTodo,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
