/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useMemo,
  useState,
} from 'react';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterOption } from './types/FilterOptions';
import { useTodo } from './hooks/useTodo';
import { getFilteredTodos } from './helpers/getFilteredTodos';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<string>(FilterOption.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const {
    todos,
    setErrorMessage,
    errorMessage,
  } = useTodo();

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filter), [filter, todos],
  );

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          activeTodos={activeTodos}
          setTempTodo={setTempTodo}
        />

        {!!filteredTodos.length && (
          <TodoList todos={filteredTodos} tempTodo={tempTodo} />
        )}

        {!!todos.length && (
          <Footer
            activeTodos={activeTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
