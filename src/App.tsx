/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodos, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import { getPreparedTodos } from './utils/getPreparedTodos';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState([0]);
  const [errorMessage, setErrorMessage] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TodoStatusFilter>(
    TodoStatusFilter.All,
  );
  const [loadingTodos, setLoadingTodos] = useState(true);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const preparedTodos = getPreparedTodos(todos, selectedFilter);

  const handleDeleteTodo = (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    deleteTodos(todoId)
      .then(() =>
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteTodo);
      })
      .finally(() => {
        setLoading((prev: number[]) => prev.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    getTodos()
      .then(todoItems => {
        setTodos(todoItems);
        setLoadingTodos(false);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadTodos);
        setLoadingTodos(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setTemporaryTodo={setTemporaryTodo}
          setErrorMessage={setErrorMessage}
          loadingTodos={loadingTodos}
        />

        <TodoList
          todos={preparedTodos}
          loading={loading}
          temporaryTodo={temporaryTodo}
          handleDeleteTodo={handleDeleteTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setLoading={setLoading}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            activeTodosCount={activeTodosCount}
            handleDeleteTodo={handleDeleteTodo}
            setSelectedFilter={setSelectedFilter}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
