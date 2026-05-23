import { useState } from 'react';
import { filterTodos } from '../utils/filterTodos';
import { Todo } from '../types/Todo';
import { FilterOption } from '../types/FilterOption';

export const useFilteredTodos = (todos: Todo[]) => {
  const [filter, setFilter] = useState<FilterOption>(FilterOption.ALL);

  const filteredTodos = filterTodos(todos, filter);

  return { filter, setFilter, filteredTodos };
};
