import React, { useState } from 'react';
import { StatusToFilter } from '../../types/StatusToFilter';

interface Props {
  children: React.ReactNode;
}

interface FilterContextInterface {
  filterStatus: StatusToFilter,
  setFilterStatus: React.Dispatch<React.SetStateAction<StatusToFilter>>,
}

export const FilterContext = React.createContext<FilterContextInterface>({
  filterStatus: StatusToFilter.All,
  setFilterStatus: () => {},
});

export const FilterProvider: React.FC<Props> = ({ children }) => {
  const [filterStatus, setFilterStatus] = useState(StatusToFilter.All);

  return (
    <FilterContext.Provider value={{ filterStatus, setFilterStatus }}>
      {children}
    </FilterContext.Provider>
  );
};
