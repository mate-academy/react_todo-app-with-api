import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { TEMP_ID, USER_ID } from './api/todos';
import { ErrorNotification } from './components/TodoErrorNotification';
import { useTodos } from './hooks/useTodos';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { ToggleAllButton } from './components/ToggleAllButton';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoFooterNav } from './components/TodoFooterNav/TodoFooterNav';
import { ClearCompletedBtn } from './components/ClearCompletedBtn';
import { TodoItem } from './components/TodoItem';
import React, { useRef } from 'react';
import { useNodeRefs } from './hooks/useNodeRefs';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    initialLoading,
    allTodosCompleted,
    itemsLeft,
    hasCompletedTodos,
    processingTodoIds,
    tempTodo,
    inputFocusRef,
    setErrorMessage,
    handleDeleteTodo,
    handleAddTodo,
    handleToggleTodo,
    handleToggleAllTodos,
    handleUpdateTodo,
    handleClearCompleted,
  } = useTodos();

  const { visibleTodos, filterParam, setFilterParam } = useFilteredTodos(todos);

  const todoListIsNotEmpty = todos.length > 0;

  const resetError = () => setErrorMessage(null);
  const loading = (id: number) => processingTodoIds.includes(id);

  const nodeRef = useNodeRefs();
  const tempNodeRef = useRef<HTMLDivElement>(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!initialLoading && todoListIsNotEmpty && (
            <ToggleAllButton
              allCompleted={allTodosCompleted}
              onToggleAll={handleToggleAllTodos}
            />
          )}

          <TodoForm
            ref={inputFocusRef}
            onSubmit={handleAddTodo}
            setErrorMessage={setErrorMessage}
            isLoading={loading(TEMP_ID)}
          />
        </header>

        {!initialLoading && (
          <section className="todoapp__main" data-cy="TodoList">
            <TransitionGroup>
              {visibleTodos.map(todo => (
                <CSSTransition
                  key={todo.id}
                  timeout={300}
                  classNames="item"
                  appear
                  nodeRef={nodeRef(todo.id)}
                >
                  <TodoItem
                    todo={todo}
                    isLoading={loading(todo.id)}
                    onDelete={handleDeleteTodo}
                    onToggle={handleToggleTodo}
                    onUpdate={handleUpdateTodo}
                    setError={setErrorMessage}
                    nodeRef={nodeRef(todo.id)}
                  />
                </CSSTransition>
              ))}
              {tempTodo && (
                <CSSTransition
                  key={tempTodo.id}
                  timeout={300}
                  classNames="temp-item"
                  appear
                  nodeRef={tempNodeRef}
                >
                  <TodoItem
                    todo={tempTodo}
                    isLoading={true}
                    onDelete={handleDeleteTodo}
                    onToggle={handleToggleTodo}
                    onUpdate={handleUpdateTodo}
                    setError={setErrorMessage}
                    nodeRef={tempNodeRef}
                  />
                </CSSTransition>
              )}
            </TransitionGroup>
          </section>
        )}

        {todoListIsNotEmpty && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft} items left`}
            </span>

            <TodoFooterNav
              filterParam={filterParam}
              setFilterParam={setFilterParam}
            />

            <ClearCompletedBtn
              hasCompleted={hasCompletedTodos}
              onClearCompleted={handleClearCompleted}
            />
          </footer>
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={resetError} />
    </div>
  );
};
