import React, { useContext, useMemo, useCallback } from 'react';

import { TodoInfo } from '../TodoInfo/TodoInfo';
import { AppContext } from '../AppContext/AppContext';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

export const TodoList: React.FC = React.memo(() => {
  const {
    allTodos,
    tempTodo,
    currentFilterMode,
  } = useContext(AppContext);

  const filterTodos = useCallback((todos: Todo[]) => {
    return todos.filter(({ completed }) => {
      switch (currentFilterMode) {
        case Filter.Active:
          return !completed;

        case Filter.Completed:
          return completed;

        default:
          return true;
      }
    });
  }, [currentFilterMode]);

  const visibleTodos = useMemo(() => filterTodos(allTodos),
    [allTodos, filterTodos]);

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoInfo key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <TodoInfo todo={tempTodo} />
      )}
    </section>
  );
});
