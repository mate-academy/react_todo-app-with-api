/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { TodosContext } from './components/TodosProvider';
import { todosFilter } from './utils/TodosFilter';
import { Filter } from './types/Status';

export const App: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const visibleTodos = todosFilter(todos, filter);

  const handleFilter = (value: Filter) => {
    setFilter(value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodosList todos={visibleTodos} />

        {!!todos.length
          && (
            <Footer filter={filter} handleFilter={handleFilter} />
          )}
      </div>
      <Notifications />
    </div>
  );
};
