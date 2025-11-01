import { useMemo, useCallback, useState } from 'react';
import { Todo, getFilteredTodos } from '../types/Todo';
import { StatusFilter } from '../types/statusFilter';

const useTodoFilters = (todos: Todo[]) => {
  const [status, setStatus] = useState(StatusFilter.All);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, status),
    [todos, status],
  );

  const todosLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const handleStatusChange = useCallback((newStatus: StatusFilter) => {
    setStatus(newStatus);
  }, []);

  return {
    status,
    filteredTodos,
    todosLeft,
    handleStatusChange,
  };
};

export default useTodoFilters;
