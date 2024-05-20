import { FC } from 'react';

import {
  Header,
  TodoList,
  Footer,
  ErrorNotification,
  TodoInfo,
} from './components';

import { useAppContext } from './hooks/useAppContext';

export const App: FC = () => {
  const { tempTodo } = useAppContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {tempTodo.isLoading && <TodoInfo />}

        <Footer />
      </div>

      <ErrorNotification />
    </div>
  );
};
