import React, { useCallback, useState } from 'react';

import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './components/hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    loadingTodosIds,
    filteredTodos,
    filter,
    setTodos,
    deleteTodo,
    updateTodo,
    toggleCompleted,
    bulkToggleCompleted,
    handleErrorMessage,
    handleRemoveError,
    handleFilterChange,
  } = useTodos();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleTempTodo = useCallback(
    (todo: Todo | null) => {
      setTempTodo(todo);
    },
    [setTempTodo],
  );

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
          onError={handleErrorMessage}
          setTempTodo={handleTempTodo}
          bulkToggleCompleted={bulkToggleCompleted}
          tempTodo={tempTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              loadingTodosIds={loadingTodosIds}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onChangeCompleted={toggleCompleted}
              key={todo.id}
            />
          ))}
        </section>

        {tempTodo && (
          <TodoItem todo={tempTodo} loadingTodosIds={loadingTodosIds} />
        )}

        {!!todos.length && (
          <Footer
            filterBy={filter}
            setFilter={handleFilterChange}
            todos={todos}
            onDelete={deleteTodo}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        handleRemoveError={handleRemoveError}
      />
    </div>
  );
};
