/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoErrors } from './components/Errors/TodoErrors';
import { Filter } from './types/FilterType';
import { useTodos } from './components/hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    setError,
    add,
    remove,
    toggle,
    hideError,
    tempTodo,
    processingTodoID,
    setProcessingTodoID,
    removeCompleted,
    toggleAll,
    updateTitle,
  } = useTodos();

  const [filter, setFilter] = useState<Filter>(Filter.All);

  // Filter todos based on the selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return todo;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onTodoAdded={add}
          isLoading={isLoading}
          toggleAll={toggleAll}
          todos={todos}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleTodoDeleted={remove}
          handleToggleCompleted={toggle}
          isLoading={isLoading}
          processingTodoID={processingTodoID}
          setProcessingTodoID={setProcessingTodoID}
          updateTitle={updateTitle}
          setError={setError}
        />
        {todos.length > 0 && (
          <Footer
            counterValue={todos.filter(todo => !todo.completed).length}
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            isLoading={isLoading}
            removeCompleted={removeCompleted}
          />
        )}
      </div>

      <TodoErrors error={error} setError={hideError} />
    </div>
  );
};
