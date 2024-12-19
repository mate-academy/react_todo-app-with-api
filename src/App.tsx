import { FC } from 'react';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

import { useTodo } from './Hooks/useTodo';

export const App: FC = () => {
  const {
    todos,
    tempTodo,
    error,
    idsForDelete,
    todosForUpdate,
    filterOption,
    completedTodosId,
    numberOfActiveTodos,
    filteredTodos,
    setTodos,
    setTempTodo,
    setFilterOption,
    handleSetError,
    handleDeleteTodos,
    handleChangeTodos,
    hideError,
  } = useTodo();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          tempTodo={tempTodo}
          onSetError={handleSetError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          onTodosChange={handleChangeTodos}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              todosForUpdate={todosForUpdate}
              onTodosChange={handleChangeTodos}
              idsForDelete={idsForDelete}
              onDeleteTodo={handleDeleteTodos}
              error={error}
            />
            <Footer
              filterOption={filterOption}
              numberOfActiveTodos={numberOfActiveTodos}
              completedTodosId={completedTodosId}
              setFilterOption={setFilterOption}
              onDeleteTodos={handleDeleteTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} hideError={hideError} />
    </div>
  );
};
