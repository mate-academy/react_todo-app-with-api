import React, { useContext, useMemo } from 'react';

import { TodoInfo } from '../TodoInfo';
import { AppContext } from '../AppContext';
import { FilterType } from '../../types/FilterType';

export const TodoList: React.FC = React.memo(() => {
  const {
    todos,
    tempTodo,
    currentFilterType,
  } = useContext(AppContext);

  const visibleTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (currentFilterType) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [todos, currentFilterType]);

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
