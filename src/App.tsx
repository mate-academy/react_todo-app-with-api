import {
  FC, useContext, useEffect, useState,
} from 'react';

import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoErrors } from './types/ErrorMessages';
import { FilterOptions } from './types/FilterOptions';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { filterByContext } from './components/FilterContext/FilterContext';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOptions>(FilterOptions.All);
  const [errorText, setErrorText] = useState<TodoErrors>(TodoErrors.none);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const loadTodosFromServer = async (id: number) => {
    try {
      const todos = await getTodos(id);

      setTodosFromServer(todos);
    } catch (error) {
      setErrorText(TodoErrors.onLoad);
    }
  };

  useEffect(() => {
    if (user) {
      loadTodosFromServer(user.id);
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onMultipleLoad={setActiveTodoIds}
          onError={setErrorText}
          onAdd={loadTodosFromServer}
          todosFromServer={todosFromServer}
        />

        {todosFromServer.length > 0 && (
          <>
            <TodoList
              activeTodoIds={activeTodoIds}
              todosFromServer={todosFromServer}
              filterBy={filterBy}
              loadTodos={loadTodosFromServer}
              setErrorMessage={setErrorText}
            />
            <filterByContext.Provider value={filterBy}>
              <Footer
                onError={setErrorText}
                onMultipleLoad={setActiveTodoIds}
                todosFromServer={todosFromServer}
                loadTodos={loadTodosFromServer}
                onFilterChange={setFilterBy}
              />
            </filterByContext.Provider>
          </>
        )}
      </div>

      <ErrorNotification
        message={errorText}
        onErrorSkip={setErrorText}
      />
    </div>
  );
};
