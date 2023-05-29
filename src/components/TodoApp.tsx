import { useState } from 'react';
import { TodoAppHeader } from './TodoAppComponent/TodoAppHeader/TodoAppHeader';
import { TodoList } from './TodoAppComponent/TodoAppMain/TodoList';
import { useTodosContext } from '../Context/TodosContext';
import { Filters } from '../types/Filters';
import { TodoAppFooter } from './TodoAppComponent/TodoAppFooter/TodoAppFooter';

export const TodoApp = () => {
  const [filtered, setFiltered] = useState<Filters>(Filters.All);
  const { todos } = useTodosContext();

  let filteredTodos = todos;

  switch (filtered) {
    case 'Active':
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;
    case 'Completed':
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;
    case 'All':
      filteredTodos = todos;
      break;
    default: throw new Error('wrong filters');
  }

  const isFooter = todos.length > 0;

  return (
    <div className="todoapp__content">
      <TodoAppHeader />

      <TodoList filteredTodos={filteredTodos} />

      {isFooter && (
        <TodoAppFooter
          filtered={filtered}
          setFiltered={setFiltered}
        />
      )}
    </div>
  );
};
