import React from 'react';
import { FILTERS } from '../constants/filters';

interface FooterContextType {
  notCompletedTodoCount: number;
  setActiveFilter: React.Dispatch<React.SetStateAction<FILTERS>>;
  isCompletedExist: boolean;
  deleteCompletedTodos: () => Promise<void>;
}

export const FooterContext = React.createContext<FooterContextType>({
  notCompletedTodoCount: 0,
  setActiveFilter: () => {},
  isCompletedExist: false,
  deleteCompletedTodos: () => Promise.resolve(),
});
