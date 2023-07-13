import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTypes } from './types/FilterTypes';

const USER_ID = 10926;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const hasTodos = todos.length > 0;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const clearFields = () => {
    setTempTodo(null);
    setIsUpdating(false);
  };

  const handleFilter = (newFilter: FilterTypes) => {
    setFilter(newFilter);
  };

  const handleError = (newError: string) => {
    setError(newError);
  };

  const handleTempTodo = (newTodo: Todo | null) => {
    setTempTodo(newTodo);
  };

  const handleIsUpdating = (status: boolean) => {
    setIsUpdating(status);
  };

  const handleUpdatingIds = (ids: number[]) => {
    setLoadingTodoIds(ids);
  };

  const handleLoadTodos = () => {
    getTodos(USER_ID)
      .then(setTodos)
      .then(clearFields)
      .catch(() => setError('Unable to load todos'));
  };

  const handleCleaner = () => {
    handleUpdatingIds([]);
    handleIsUpdating(false);
  };

  const handleDeleteCompleted = () => {
    handleIsUpdating(true);
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    handleUpdatingIds(completedIds);

    Promise.all(
      completedIds.map(id => deleteTodo(id)
        .catch(() => handleError('Unable to delete a todo'))),
    ).finally(() => {
      handleCleaner();
    });
  };

  const handleUpdateAllCompleted = () => {
    handleIsUpdating(true);
    let isAllCompleted = true;
    const AllIds = todos.map(todo => {
      if (!todo.completed) {
        isAllCompleted = false;
      }

      return todo.id;
    });

    handleUpdatingIds(AllIds);
    const updatedTodo = {
      completed: !isAllCompleted,
    };

    AllIds.forEach(id => {
      updateTodo(id, updatedTodo)
        .then(() => handleCleaner())
        .catch(() => handleError('Unable to update a todo'));
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          userId={USER_ID}
          handleError={handleError}
          handleTempTodo={handleTempTodo}
          handleIsUpdating={handleIsUpdating}
          handleUpdatingIds={handleUpdatingIds}
          handleUpdateAllCompleted={handleUpdateAllCompleted}
        />

        <TodoList
          todos={todos}
          filter={filter}
          tempTodo={tempTodo}
          handleError={handleError}
          isUpdating={isUpdating}
          handleIsUpdating={handleIsUpdating}
          updatingIds={loadingTodoIds}
          handleUpdatingIds={handleUpdatingIds}
          handleLoadTodos={handleLoadTodos}
        />

        {hasTodos && (
          <Footer
            todos={todos}
            filter={filter}
            handleFilter={handleFilter}
            handleError={handleError}
            handleIsUpdating={handleIsUpdating}
            handleUpdatingIds={handleUpdatingIds}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {error && <ErrorNotification error={error} />}
    </div>
  );
};
