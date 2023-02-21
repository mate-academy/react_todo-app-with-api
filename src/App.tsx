/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { TodosContext } from './components/TodosProvider';
import { TodosFilter } from './utils/TodosFilter';

export const App: React.FC = () => {
  const {
    todos,
    filter,
  } = useContext(TodosContext);

  const visibleTodos = TodosFilter(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={visibleTodos} />
        <TodosList todos={visibleTodos} />

        {!!todos.length
          && (
            <Footer todos={visibleTodos} />
          )}
      </div>
      <Notifications />
    </div>
  );
};
