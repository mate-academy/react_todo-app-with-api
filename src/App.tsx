/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { SortField } from './types/SortField';
import { getSortedTodos } from './utils/getSortedTodos';
import { ErrorType } from './types/Error';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sortField, setSortField] = useState<SortField>(SortField.All);
  const [error, setError] = useState<ErrorType | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorType.LoadFail));
  }, []);

  const sortedTodos = getSortedTodos(todos, sortField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setError={setError}
          setLoadingIds={setLoadingIds}
        />
        <TodoList
          todos={sortedTodos}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setError={setError}
          setLoadingIds={setLoadingIds}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isTemp={true}
            loadingIds={loadingIds}
            setTodos={setTodos}
            setError={setError}
            setLoadingIds={setLoadingIds}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
            setTodos={setTodos}
            setError={setError}
            setLoadingIds={setLoadingIds}
          />
        )}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
};
