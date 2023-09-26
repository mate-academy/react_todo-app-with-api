import React, { useState } from 'react';
import { StatusEnum } from '../../types/StatusEnum';

interface IFilterTodosContext {
  filter: StatusEnum;
  setFilter: React.Dispatch<React.SetStateAction<StatusEnum>>;
}

export const FilterTodosContext = React
  .createContext({} as IFilterTodosContext);

type Props = {
  children: React.ReactNode;
};

export const FilterTodosContextProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = useState<StatusEnum>(
    window.location.hash.slice(2) as StatusEnum || StatusEnum.All,
  );

  return (
    <FilterTodosContext.Provider value={{
      filter,
      setFilter,
    }}
    >
      {children}
    </FilterTodosContext.Provider>
  );
};
