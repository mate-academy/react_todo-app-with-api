/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { TodosContext } from './components/TodosProvider';
import { Filter } from './types/Status';

export const App: React.FC = () => {
  const {
    todos,
    filter,
  } = useContext(TodosContext);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ALL:
        return true;

      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        throw new Error('Unexpected status');
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />
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
