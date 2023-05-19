import React from 'react';
import { FILTERS } from '../constants/filters';

interface FooterContextType {
  notCompletedTodoCount: number;
  setActiveFilter: React.Dispatch<React.SetStateAction<FILTERS>>;
  activeFilter: FILTERS;
  isCompletedExist: boolean;
  deleteCompletedTodos: () => Promise<void>;
}

export const FooterContext = React.createContext<FooterContextType>({
  notCompletedTodoCount: 0,
  setActiveFilter: () => {},
  activeFilter: FILTERS.ALL,
  isCompletedExist: false,
  deleteCompletedTodos: () => Promise.resolve(),
});
