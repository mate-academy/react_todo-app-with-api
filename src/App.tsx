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

  const handleFilterChange = (newFilter: FilterTypes) => {
    setFilter(newFilter);
  };

  const changeErrorText = (newError: string) => {
    setError(newError);
  };

  const addTempTodo = (newTodo: Todo | null) => {
    setTempTodo(newTodo);
  };

  const handleIsUpdating = (status: boolean) => {
    setIsUpdating(status);
  };

  const handleUpdatingIds = (ids: number[]) => {
    setLoadingTodoIds(ids);
  };

  const loadTodos = () => {
    getTodos(USER_ID)
      .then(setTodos)
      .then(clearFields)
      .catch(() => setError('Unable to load todos'));
  };

  const handleCleanUp = () => {
    handleUpdatingIds([]);
    handleIsUpdating(false);
  };

  const deleteCompletedTodos = () => {
    handleIsUpdating(true);
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    handleUpdatingIds(completedIds);

    Promise.all(
      completedIds.map(id => deleteTodo(id)
        .catch(() => changeErrorText('Unable to delete a todo'))),
    ).finally(() => {
      handleCleanUp();
    });
  };

  const updateCompletedTodos = () => {
    handleIsUpdating(true);
    let isAllCompleted = true;
    const allIds = todos.map(todo => {
      if (!todo.completed) {
        isAllCompleted = false;
      }

      return todo.id;
    });

    handleUpdatingIds(allIds);
    const updatedTodo = {
      completed: !isAllCompleted,
    };

    allIds.forEach(id => {
      updateTodo(id, updatedTodo)
        .then(() => handleCleanUp())
        .catch(() => changeErrorText('Unable to update a todo'));
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
          changeErrorText={changeErrorText}
          addTempTodo={addTempTodo}
          handleIsUpdating={handleIsUpdating}
          handleUpdatingIds={handleUpdatingIds}
          updateCompletedTodos={updateCompletedTodos}
        />

        <TodoList
          todos={todos}
          filter={filter}
          tempTodo={tempTodo}
          changeErrorText={changeErrorText}
          isUpdating={isUpdating}
          handleIsUpdating={handleIsUpdating}
          updatingIds={loadingTodoIds}
          handleUpdatingIds={handleUpdatingIds}
          loadTodos={loadTodos}
        />

        {hasTodos && (
          <Footer
            todos={todos}
            filter={filter}
            handleFilterChange={handleFilterChange}
            changeErrorText={changeErrorText}
            handleIsUpdating={handleIsUpdating}
            handleUpdatingIds={handleUpdatingIds}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {error && <ErrorNotification error={error} />}
    </div>
  );
};
