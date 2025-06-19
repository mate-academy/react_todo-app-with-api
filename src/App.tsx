import React, { useState } from 'react';
import * as todosApi from './api/todos';
import { useTodoActions } from './hooks/useTodoActions';
import { prepareTodoList } from './utils/prepareTodoList';

import { FilterParams, Todo } from './types/types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { UserWarning } from './components/UserWarning';
import { AppHeader } from './components/AppHeader';
import { TodoItem } from './components/TodoItem';
import { AppFooter } from './components/AppFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const {
    isAllTodoCompleted,
    isCompletedTodos,
    todoInOperation,
    errorMessage,
    activeTodos,
    isLoading,
    tempTodo,
    todoData,
    hasTodo,
    setErrorMessage,
    deleteCompleted,
    handleUpdate,
    deleteTodo,
    toggleTodo,
    toggleAll,
    addTodo,
  } = useTodoActions();

  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);

  const todoList = prepareTodoList(todoData, filter);

  if (!todosApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AppHeader
          isAllTodoCompleted={isAllTodoCompleted}
          isLoading={isLoading}
          hasTodo={hasTodo}
          toggleAll={toggleAll}
          addTodo={addTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {todoList.map((todo: Todo) => {
              const isOverlayActive = todoInOperation.includes(todo.id);

              return (
                <CSSTransition key={todo.id} timeout={300} classNames="item">
                  <TodoItem
                    isOverlayActive={isOverlayActive}
                    todo={todo}
                    handleUpdate={handleUpdate}
                    deleteTodo={deleteTodo}
                    toggleTodo={toggleTodo}
                  />
                </CSSTransition>
              );
            })}

            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem todo={tempTodo} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {hasTodo && (
          <AppFooter
            isCompletedTodos={isCompletedTodos}
            filter={filter}
            activeTodos={activeTodos}
            deleteCompleted={deleteCompleted}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
