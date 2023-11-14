/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

const USER_ID = 11359;

enum QueryTodos {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMassege, setErrorMassege] = useState('');
  const [query, setQuery] = useState<string>(QueryTodos.all);
  const [isSpinner, setIsSpinner] = useState(false);
  const [cuurentId, setCurrentId] = useState(0);
  const [date, setDate] = useState(new Date());
  const [spinnerForTodos, setSpinnerForTodos] = useState(false);

  const timerId = useRef(0);

  const hideError = () => {
    timerId.current = window.setTimeout(() => setErrorMassege(''), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMassege('unable to load todos');
        hideError();
      });

    return () => window.clearTimeout(timerId.current);
  }, [date]);

  const isCompletedTodo = todos.some(todo => todo.completed);

  const isCompletedAllTodos = todos.some(todo => !todo.completed);

  const getNumberActiveTodos = (items: Todo[]) => {
    const activeTodos = items.filter(todo => !todo.completed);

    return activeTodos.length;
  };

  const numberOfActive = useMemo(() => {
    return getNumberActiveTodos(todos);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (param: string) => {
    switch (param) {
      case QueryTodos.active: {
        return todos.filter(todo => !todo.completed);
      }

      case QueryTodos.completed: {
        return todos.filter(todo => todo.completed);
      }

      default:
        return todos;
    }
  };

  const removeTodoFromList = (todoId: number) => {
    setTodos(currentTodos => {
      const updatedListTodos = currentTodos.filter(todo => todo.id !== todoId);

      return [...updatedListTodos];
    });
  };

  const addNewTodoToList = (newTodo: Todo) => {
    setTodos(currentTodos => {
      return [...currentTodos, newTodo];
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMassege={setErrorMassege}
          hideError={hideError}
          userId={USER_ID}
          addTodo={addNewTodoToList}
          spinnerStatus={setIsSpinner}
          changeDate={setDate}
          changeCurrentId={setCurrentId}
          setTodos={setTodos}
          todos={todos}
          isCompletedAllTodos={isCompletedAllTodos}
          setSpinnerForTodos={setSpinnerForTodos}
        />
        <Main
          todos={filterTodos(query)}
          removeTodo={removeTodoFromList}
          setErrorMassege={setErrorMassege}
          hideError={hideError}
          spinner={isSpinner}
          spinnerStatus={setIsSpinner}
          cuurentId={cuurentId}
          changeCurrentId={setCurrentId}
          setDate={setDate}
          userId={USER_ID}
          spinnerForTodos={spinnerForTodos}
        />

        {!!todos.length && (
          <Footer
            changeQuery={setQuery}
            isCompletedTodo={isCompletedTodo}
            numberActive={numberOfActive}
            status={query}
            todos={todos}
            setDate={setDate}
            setErrorMassege={setErrorMassege}
            setIsSpinner={setIsSpinner}
          />
        )}
      </div>

      {errorMassege && (
        <div
          className={classNames('notification is-danger is-light has-text-weight-normal', { hidden: !errorMassege })}
        >
          <button
            onClick={() => setErrorMassege('')}
            type="button"
            className="delete"
          />

          {/* show only one message at a time */}
          {errorMassege}
        </div>
      )}
    </div>
  );
};
