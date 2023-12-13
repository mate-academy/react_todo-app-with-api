import { useContext, useMemo } from 'react';

import { StateContext } from './TodosProvider';
import { FilterStatus } from '../types/FilterStatus';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const { todos, filteredBy } = useContext(StateContext);

  const visibleGoods = useMemo(() => (
    todos
      ? todos.filter(todo => {
        switch (filteredBy) {
          case FilterStatus.Active:
            return !todo.completed;

          case FilterStatus.Completed:
            return todo.completed;

          default:
            return todo;
        }
      })
      : []

  ), [filteredBy, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleGoods.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
