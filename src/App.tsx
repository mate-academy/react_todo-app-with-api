/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import { USER_ID, getTodos, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoStatusFilter, filterTodo } from './types/TodoFilter';
import { ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TodoStatusFilter>(
    TodoStatusFilter.All,
  );
  const [errorNotification, setErrorNotification] = useState('');
  const [loading, setLoading] = useState([0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState(true);

  const preparedTodos = filterTodo(todos, selectedFilter);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleDeleteTodo = (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorNotification(ErrorMessage.DeleteTodo);
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
        setErrorNotification(ErrorMessage.LoadTodos);
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
          setTempTodo={setTempTodo}
          setErrorNotification={setErrorNotification}
          loadingTodos={loadingTodos}
        />

        <TodoList
          todos={preparedTodos}
          loading={loading}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          setTodos={setTodos}
          setErrorNotification={setErrorNotification}
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

      <ErrorNotification
        errorNotification={errorNotification}
        setErrorNotification={setErrorNotification}
      />
    </div>
  );
};
