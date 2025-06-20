/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorComponent } from './components/ErrorComponent/ErrorComponent';
import { Footer } from './components/Footer/Footer';
import { useTodo } from './hooks/useTodo';
import { FormComponent } from './components/FormComponent/FormComponent';
import { ToggleAll } from './components/ToggleAll/ToggleAll';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    visibleTodos,
    todoIdsToDelete,
    setFilterStatus,
    filterStatus,
    completedTodoExists,
    numberOfNotCompletedTodos,
    setTodoIdsToDelete,
    setTodoIdsToUpdate,
    todoIdsToUpdate,
  } = useTodo();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleAll
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setTodoIdsToUpdate={setTodoIdsToUpdate}
          />
          <FormComponent
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          todoIdsToDelete={todoIdsToDelete}
          todoIdsToUpdate={todoIdsToUpdate}
          setTodoIdsToDelete={setTodoIdsToDelete}
          setTodoIdsToUpdate={setTodoIdsToUpdate}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            completedTodoExists={completedTodoExists}
            numberOfNotCompletedTodos={numberOfNotCompletedTodos}
            setTodoIdsToDelete={setTodoIdsToDelete}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <ErrorComponent
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
