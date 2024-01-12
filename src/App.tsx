/* eslint-disable max-len */
import React, { useContext } from 'react';
import { TodosList } from './components/TodosList';
import { TodosInputForm } from './components/TodosInputForm';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosContext } from './components/TodosContext';
import { TodosControls } from './components/TodosControls';
import { TodosToggleAll } from './components/TodosToggleAll';

export const App: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const hasTodo = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">

        <header className="todoapp__header">
          {hasTodo && <TodosToggleAll />}
          <TodosInputForm />
        </header>

        <TodosList />
        {hasTodo && <TodosControls />}

      </div>
      <ErrorNotification />
    </div>
  );
};
