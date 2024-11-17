import React, { useEffect, useMemo, useState } from 'react';
import { FilterOptions, ErrorMessages } from './enums/';
import { filteredTodos, loadTodos } from './utils/';
import { Header, Footer, TodoList, Errors } from './components/';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NO_ERRORS);

  const {
    todos,
    tempTodo,
    loadingTodosCount,
    inputRef,
    inputValue,
    handleSubmit,
    handleUpdateTodo,
    handleTodoDelete,
    setTodos,
    handleTodosToggle,
    handleTodoToggle,
    handleCompletedTodosDeleted,
    handleInputChange,
  } = useTodos(setErrorMessage);

  const todosAfterFiltering = useMemo(
    () => filteredTodos(todos, filter),
    [todos, filter],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, inputRef]);

  useEffect(() => {
    loadTodos(setTodos, setErrorMessage);
  }, [setTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          value={inputValue}
          todos={todos}
          completedTodos={completedTodos}
          inputRef={inputRef}
          loadingTodos={loadingTodosCount}
          onTodosToggle={handleTodosToggle}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />

        <TodoList
          tempTodo={tempTodo}
          todosAfterFiltering={todosAfterFiltering}
          loadingTodos={loadingTodosCount}
          inputRef={inputRef}
          onTodoDelete={handleTodoDelete}
          onTodoToggle={handleTodoToggle}
          onUpdateTodo={handleUpdateTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            onCompletedTodosDeleted={handleCompletedTodosDeleted}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
