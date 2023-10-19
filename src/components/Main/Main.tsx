import React, { useContext } from 'react';

import './Main.scss';
import { TodosContext } from '../TodosContext';
import { TodoItem } from '../TodoItem';
import { getVisibleTodos } from '../../utils/getVisibleTodos';

export const Main: React.FC = () => {
  const { todos, currentFilter } = useContext(TodosContext);

  const visibleTodos = getVisibleTodos(todos, currentFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} item={todo} />
      ))}
    </section>
  );
};
