import React, { useContext, useMemo } from 'react';

import { TodoInfo } from '../TodoInfo';
import { AppContext } from '../AppContext';
import { FilterType } from '../../types/FilterType';

export const TodoList: React.FC = React.memo(() => {
  const {
    allTodos,
    tempTodo,
    currentFilterType,
  } = useContext(AppContext);

  const visibleTodos = useMemo(() => (
    allTodos.filter(({ completed }) => {
      switch (currentFilterType) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [allTodos, currentFilterType]);

  window.console.log('Rendering todo list');

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
