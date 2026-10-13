import { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { useTodos } from './hooks/useTodos';
import { FilterType } from './types/Filter';

export const App: React.FC = () => {
  const [filterType, setFilterType] = useState(FilterType.All);
  const {
    todos,
    error,
    hideError,
    value,
    setValue,
    tempTodo,
    inputRef,
    processingIds,
    activeCount,
    hasCompletedTodos,
    hasAllTodosCompleted,
    handleSubmit,
    handleDelete,
    handleClearCompleted,
    handleUpdate,
    handleToggleAll,
  } = useTodos();

  const visibleTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return true;
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          hasTodos={todos.length > 0}
          hasAllTodosCompleted={hasAllTodosCompleted}
          onToggleAll={handleToggleAll}
          value={value}
          onValueChange={setValue}
          isAdding={tempTodo !== null}
          inputRef={inputRef}
          onSubmit={handleSubmit}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            onDelete={handleDelete}
            processingIds={processingIds}
            tempTodo={tempTodo}
            todos={visibleTodos}
            onUpdate={handleUpdate}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filterType={filterType}
            hasCompleted={hasCompletedTodos}
            onFilterChange={setFilterType}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onHide={hideError} />
    </div>
  );
};
