import { Dispatch, SetStateAction } from 'react';
import { FilterType } from './FilterType';
import { Todo } from './Todo';

export type FooterType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  currentFilter: string;
  setCurrentFilter: (filter: FilterType) => void;
  setError: Dispatch<SetStateAction<string>>;
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>;
};
