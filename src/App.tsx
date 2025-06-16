import React, { useMemo, useState } from 'react';

import * as TodosService from './api/todos';
import { UserWarning } from './UserWarning';
import { Filter } from './types/Filter';
import { getVisibleTodos } from './utils/getVisibleTodos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoItem } from './components/TodoItem';
import { useTodos } from './hooks/useTodos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    errorMessage,
    todoLoadingIds,
    setErrorMessage,
    addTodo,
    updateTodoStatus,
    updateTodoTitle,
    deleteTodo,
    handleClearCompleted,
    handleToggleAllCompleted,
  } = useTodos();

  const [filter, setFilter] = useState<Filter>(Filter.All);
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filter),
    [todos, filter],
  );

  if (!TodosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onSubmit={addTodo}
          isLoading={!!todoLoadingIds.length}
          onToggleAllCompleted={handleToggleAllCompleted}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onTodoDelete={deleteTodo}
                  isLoading={todoLoadingIds.includes(todo.id)}
                  onStatusChange={updateTodoStatus}
                  onTitleUpdate={updateTodoTitle}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem todo={tempTodo} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorChange={setErrorMessage}
      />
    </div>
  );
};
