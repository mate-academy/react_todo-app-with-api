import React from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const useTodoFilter = (todoList: Todo[]) => {
  const [filterByStatus, setFilterByStatus] = React.useState<TodoStatus>(
    TodoStatus.All,
  );

  const filteredTodosList = React.useMemo(() => {
    switch (filterByStatus) {
      case TodoStatus.All:
        return todoList;

      case TodoStatus.Active:
        return todoList.filter(todo => !todo.completed);

      case TodoStatus.Completed:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [filterByStatus, todoList]);

  const activeTodosCount = React.useMemo(() => {
    return todoList.filter(todo => !todo.completed).length;
  }, [todoList]);

  return {
    filterByStatus,
    setFilterByStatus,
    filteredTodosList,
    activeTodosCount,
  };
};
