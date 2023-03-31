import { FC } from 'react';
import { useApp } from './hooks/useApp';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorModal } from './components/ErrorModal/ErrorModal';
import { LoadContext } from './Context/LoadContext';
import { UserWarning } from './UserWarning';

const USER_ID = 6748;

export const App: FC = () => {
  const {
    todos,
    error,
    tempTodo,
    filterType,
    addNewTodo,
    deleteTodo,
    unableField,
    activeTodos,
    visibleTodos,
    loadingTodos,
    setFilterType,
    completedTodos,
    updateTodoStatus,
    updateAllStatus,
    handleCloseError,
    handleDeleteCompleted,
  } = useApp();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadContext.Provider value={loadingTodos}>
      <div className="todoapp">
        <h1 className="todoapp__title">
          todos
        </h1>

        <div className="todoapp__content">
          <Header
            onAdd={addNewTodo}
            disabled={unableField}
            activeTodos={activeTodos.length}
            onUpdateAllStatus={updateAllStatus}
          />

          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            onChange={updateTodoStatus}
          />

          {todos.length > 0 && (
            <Footer
              filterType={filterType}
              onChangeFilterType={setFilterType}
              onRemoveCompleted={handleDeleteCompleted}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
            />
          )}
        </div>

        {error && (
          <ErrorModal
            error={error}
            onClose={handleCloseError}
          />
        )}
      </div>
    </LoadContext.Provider>
  );
};
