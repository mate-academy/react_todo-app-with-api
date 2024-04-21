/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { todosContext } from './Store';
import { Footer } from './components/Footer/Footer';
import { errorText } from './constants';
import { items } from './utils/utils';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoWithLoader } from './types/TodoWithLoader';

export const App: React.FC = () => {
  const [state, setters] = useContext(todosContext);
  const timerId = useRef(0);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        if (todosFromServer) {
          const newTodos: TodoWithLoader[] = todosFromServer.map(todo => {
            return {
              ...todo,
              loading: false,
            };
          });

          setters.setTodos(newTodos);
        } else {
          setters.setTodos([]);
        }
      })
      .catch(() => {
        setters.setErrorMessage(errorText.noTodos);
      });
  }, []);

  useEffect(() => {
    if (state.errorMessage) {
      clearTimeout(timerId.current);
      timerId.current = window.setTimeout(() => {
        setters.setErrorMessage('');
      }, 3000);
    }
  }, [state.errorMessage, state.loading, setters]);

  const displayedTodos = useMemo(() => {
    return items.filter(state.todos, state.filter);
  }, [state.todos, state.filter, state.updatedAt]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {state.todos.length > 0 && (
          <>
            <TodoList
              todos={displayedTodos}
              updatedAt={state.updatedAt}
              tempTodo={state.tempTodo}
            />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification errorMessage={state.errorMessage} />
    </div>
  );
};
