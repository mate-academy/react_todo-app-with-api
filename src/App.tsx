/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useCallback, useEffect } from 'react';
import { getTodos, USER_ID } from './api/todos';
import { ErrorMessages } from './enums/ErrorMessages';
import { useTodoActions } from './hooks/useTodoActions';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';

export const App: FC = () => {
  const {
    todos,
    setTodos,
    todosLoading,
    setTodosLoading,
    filter,
    setFilter,
    tempTodo,
    processingTodoIds,
    deleteSingleTodo,
    deleteCompletedTodos,
    addNewTodo,
    isTodoSubmitting,
    toggleStatusSingleTodo,
    toggleStatusTodos,
    isAllTodosCompleted,
    onUpdateTodo,
    errorMessage,
    setErrorMessage,
  } = useTodoActions();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setTodosLoading(true);
        setErrorMessage(null);
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(ErrorMessages.FetchFailed);
      } finally {
        setTodosLoading(false);
      }
    };

    fetchTodos();
  }, [setErrorMessage, setTodos, setTodosLoading]);

  const handleHideError = useCallback(() => {
    setErrorMessage(ErrorMessages.None);
  }, [setErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          processingTodoIds={processingTodoIds}
          addNewTodo={addNewTodo}
          isTodoSubmitting={isTodoSubmitting}
          onToggleStatusTodos={toggleStatusTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        {!todosLoading && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              onDeleteTodo={deleteSingleTodo}
              tempTodo={tempTodo}
              processingTodoIds={processingTodoIds}
              onToggleStatusSingleTodo={toggleStatusSingleTodo}
              onUpdateTodo={onUpdateTodo}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                onDeleteCompleted={deleteCompletedTodos}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
