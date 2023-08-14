import { FC, useEffect } from 'react';

import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoForm } from './components/TodoForm/TodoForm';
import { filteredTodos } from './helpers';
import { Footer } from './components/Footer';
import { TodoModal } from './components/TodoModal/TodoModal';
import { useTodosContext } from './context/useTodosContext';

const USER_ID = 10917;

export const App: FC = () => {
  const {
    todos,
    setTodos,
    setVisibleTodos,
    filter,
    errorMessage,
    setErrorMessage,
    formLoader,
    tempTodo,
  } = useTodosContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos(USER_ID);

        setTodos(response);
      } catch (error) {
        throw new Error('Data not found');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleTodos(filteredTodos(todos, filter));
  }, [filter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm />
        </header>

        <section className="todoapp__main">

          <div>
            <TodoList />

            {(formLoader && tempTodo) && (
              <TodoModal />
            )}
          </div>
        </section>

        {todos.length !== 0 && (
          <Footer />
        )}
      </div>
      {errorMessage && (
        <div
          className="
          notification
          is-danger
          is-light
          has-text-weight-normal"
        >
          <button
            aria-label=" "
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          <br />
          {errorMessage}
          <br />
        </div>
      )}
    </div>
  );
};
