import { useTodo } from './hooks/useTodo';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';

export const App = () => {
  const {
    todos,
    todosAmount,
    loadingTodoIds,
    tempTodo,
    editingTodo,
    setEditingTodo,
    activeTodosAmount,
    errorMessage,
    handleResetErrorMessage,
    statusFilter,
    setStatusFilter,
    handleDeleteTodo,
    handleClearCompleted,
    isFocusedNewTodoInput,
    newTodoTitle,
    handleNewTodoTitleChange,
    isLoadingNewTodoSubmit,
    handleAddTodoFormSubmit,
    handleToggleTodo,
    handleToggleAllTodos,
    handleRenameTodo,
  } = useTodo();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todosAmount={todosAmount}
          activeTodosAmount={activeTodosAmount}
          isFocusedInput={isFocusedNewTodoInput}
          newTodoTitle={newTodoTitle}
          onTitleChange={handleNewTodoTitleChange}
          isLoadingSubmit={isLoadingNewTodoSubmit}
          onSubmitForm={handleAddTodoFormSubmit}
          onToggleAllTodos={handleToggleAllTodos}
        />

        <TodoList
          todos={todos}
          todosAmount={todosAmount}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          editingTodo={editingTodo}
          setEditingTodo={setEditingTodo}
          statusFilter={statusFilter}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodo={handleToggleTodo}
          onRenameTodo={handleRenameTodo}
        />

        {!!todosAmount && (
          <TodoFooter
            leftTodos={activeTodosAmount}
            statusFilter={statusFilter}
            onChangeStatusFilter={setStatusFilter}
            todosAmount={todosAmount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <TodoErrorNotification
        errorMessage={errorMessage}
        onResetErrorMessage={handleResetErrorMessage}
      />
    </div>
  );
};
