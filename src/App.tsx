// #region import
import React, { useState } from 'react';

import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorBlock } from './components/ErrorBlock';
import { Footer } from './components/Footer';
import { useTodos } from './hooks/useTodos';
import { FiltersList } from './types/FiltersList';
import { USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
// #endregion

export const App: React.FC = () => {
  const {
    todoList,
    errorMessage,
    setErrorMessage,
    tempTodo,
    processingIds,
    addTodo,
    deleteTodo,
    toggleAllStatus,
    toggleTodoStatus,
    updateTodoTitle,
    clearCompleted,
    isAllCompleted,
  } = useTodos();

  const [filter, setFilter] = useState<FiltersList>(FiltersList.all);

  const itemsLeft = todoList.filter(todo => !todo.completed).length;
  const hasCompleted = todoList.some(todo => todo.completed);

  const visibleTodos = todoList.filter(todo => {
    switch (filter) {
      case FiltersList.active:
        return !todo.completed;
      case FiltersList.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoList={todoList}
          onError={setErrorMessage}
          onAdd={addTodo}
          isDisabled={tempTodo !== null}
          isAllCompleted={isAllCompleted}
          onToggleAllStatus={toggleAllStatus}
        />

        {(todoList.length > 0 || tempTodo) && (
          <TodoList
            todoList={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={deleteTodo}
            onToggleStatus={toggleTodoStatus}
            onUpdate={updateTodoTitle}
          />
        )}

        {todoList.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filter={filter}
            onFilterChange={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorBlock errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
