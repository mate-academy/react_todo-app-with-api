import { FC } from 'react';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/footer';
import { Error } from './components/error';
import { GlobalProvider } from './contexts/GlobalContext';
import { DeleteProvider } from './contexts/DeleteContext';
import { EditProvider } from './contexts/EditContext';

export const App: FC = () => (
  <GlobalProvider>
    <DeleteProvider>
      <EditProvider>
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <NewTodo />

            <TodoList />

            <Footer />
          </div>

          <Error />
        </div>
      </EditProvider>
    </DeleteProvider>
  </GlobalProvider>
);
