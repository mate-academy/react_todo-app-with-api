import { useContext, useEffect } from 'react';

import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

import { getTodos } from './api/todos';
import { USER_ID } from './utils/variables';
import { TodoList } from './components/TodoList';
import { TodosContext } from './components/TodosContext';
import { ErrorMessage } from './types/ErrorMessage';

export const App = () => {
  const {
    todos,
    setTodos,
    setFilteredTodos,
    setAlarm,
  } = useContext(TodosContext);

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then(todosFromServer => {
          setTodos(todosFromServer);
          setFilteredTodos(todosFromServer);
          setAlarm(ErrorMessage.Default);
        })
        .catch(errorMessage => {
          // eslint-disable-next-line no-console
          console.log(errorMessage);
          setAlarm(ErrorMessage.isLoadTodoError);
          setTodos([]);
        });
    }
  }, [USER_ID]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <>
            <TodoList />

            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
