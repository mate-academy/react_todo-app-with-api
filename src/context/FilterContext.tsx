import { useState, createContext, useContext } from 'react';
import { Status } from '../types/Status';

interface FilterContextType {
  selectedFilter: Status;
  setSelectedFilter: React.Dispatch<React.SetStateAction<Status>>;
}

export const FilterContext = createContext<FilterContextType>({
  selectedFilter: Status.All,
  setSelectedFilter: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<Props> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState<Status>(Status.All);

  const value = {
    selectedFilter,
    setSelectedFilter,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  return useContext(FilterContext);
};
