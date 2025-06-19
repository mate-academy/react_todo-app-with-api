/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { useTodo } from './hooks/useTodo';
import { Error } from './components/Error';
import { ToggleAllButton } from './components/ToggleAllButton';
import { useMemo, useRef } from 'react';
import { Todo } from './types/Todo';
import { TodoForm } from './components/TitleForm';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: todos,
    isLoading,
    errorMessage,
    tempTodo,
    todoIdsInProgress,
    hasCompletedTodos,
    hasActiveTodos,
    setErrorMessage,
    deleteTodo,
    addTodo,
    deleteCompletedTodos,
    updateTodo,
    toggleTodos,
    visibleTodos,
    filter,
    setFilter,
    countOfActiveTodos,
  } = useTodo();

  const isTodoListNotEmpty = useMemo(() => todos.length > 0, [todos]);
  const isTodoInProgressNotEmpty = useMemo(
    () => todoIdsInProgress.length > 0,
    [todoIdsInProgress],
  );

  const isFooterVisible = useMemo(() => {
    return isTodoListNotEmpty && !isLoading;
  }, [isTodoListNotEmpty, isLoading]);

  const handleDeleteTodo = (todoId: number) => {
    return deleteTodo(todoId).then(() => {
      inputRef.current?.focus();
    });
  };

  const handleUpdateTodo = (updatedTodo: Todo, shouldRefocus = false) => {
    return updateTodo(updatedTodo).then(() => {
      if (shouldRefocus) {
        inputRef.current?.focus();
      }
    });
  };

  const handleDeleteCompletedTodos = () => {
    return deleteCompletedTodos().then(() => {
      inputRef.current?.focus();
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {isTodoListNotEmpty && !isLoading && (
            <ToggleAllButton
              toggleTodos={toggleTodos}
              hasActiveTodos={hasActiveTodos}
              isTodoInProgressNotEmpty={isTodoInProgressNotEmpty}
            />
          )}

          <TodoForm
            ref={inputRef}
            onSubmit={addTodo}
            setErrorMessage={setErrorMessage}
          />
        </header>

        {!isLoading && (
          <TodoList
            todos={visibleTodos}
            deleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            onSubmit={handleUpdateTodo}
            todosInProgress={todoIdsInProgress}
            setErrorMessage={setErrorMessage}
          />
        )}

        {isFooterVisible && (
          <TodoFooter
            setFilter={setFilter}
            filter={filter}
            deleteCompletedTodos={handleDeleteCompletedTodos}
            hasCompletedTodos={hasCompletedTodos}
            countOfActiveTodos={countOfActiveTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
