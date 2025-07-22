import { useTodos } from './hooks/useTodos';
import { USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const {
    isAllCompleted,
    handleSubmit,
    setNewTodoTitle,
    newTodoTitle,
    isLoading,
    inputRef,
    toggleAllTodos,
    isTodoListNotEmpty,
    shouldShowTodoList,
    filteredTodos,
    tempTodo,
    handleDelete,
    pendingTodoIds,
    updateTodo,
    numberOfActiveTodos,
    selectedFilterParam,
    handleChangeFilterParam,
    clearCompletedTodos,
    hasCompletedTodo,
    errorMessage,
    clearMessage,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          handleSubmit={handleSubmit}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
          inputRef={inputRef}
          toggleAllTodos={toggleAllTodos}
          isTodoListNotEmpty={isTodoListNotEmpty}
        />

        {shouldShowTodoList && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
            pendingTodoIds={pendingTodoIds}
            updateTodo={updateTodo}
          />
        )}
        {isTodoListNotEmpty && (
          <Footer
            numberOfActiveTodos={numberOfActiveTodos}
            selectedFilterParam={selectedFilterParam}
            handleChangeFilterParam={handleChangeFilterParam}
            clearCompletedTodos={clearCompletedTodos}
            hasCompletedTodo={hasCompletedTodo}
          />
        )}
      </div>
      <ErrorMessage message={errorMessage} clearMessage={clearMessage} />
    </div>
  );
};
