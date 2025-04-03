/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoList } from './components/TodoList';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { FooterTodoApp } from './components/FooterTodoApp';
import { TodoError } from './components/TodoError';
import { useTodoController } from './useTodoController';

export const App: React.FC = () => {
  const {
    setFilterStatus,
    handleCheckAll,
    handleAddTodo,
    setErrorDefault,
    handleOnDelete,
    handleUpdateTodo,
    handleClearAllCompleted,
    setErrorMessage,
    filterStatus,
    errorMessage,
    isFocusAddForm,
    filteredTodos,
    tempTodo,
    todos,
  } = useTodoController();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodoApp
          onCheckAll={handleCheckAll}
          onAddTodo={handleAddTodo}
          todos={todos}
          isFocusAddForm={isFocusAddForm.current}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={filteredTodos}
          onUpdateTodo={handleUpdateTodo}
          onDelete={handleOnDelete}
        />

        {!!todos.length && (
          <FooterTodoApp
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            onClearCompleted={handleClearAllCompleted}
          />
        )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        setErrorDefault={setErrorDefault}
      />
    </div>
  );
};
