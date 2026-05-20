/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { USER_ID } from './api/todos';
import { useError } from './hooks/useError';
import { useTodoFilter } from './hooks/useTodoFilter';
import { useTodos } from './hooks/useTodos';
import { useTodoLoading } from './hooks/useTodoLoading';
import { useTodoActions } from './hooks/useTodoActions';

export const App: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { error, setError } = useError();

  const { todoList, setTodoList } = useTodos({
    inputRef,
    setError,
  });

  const { loadingTodoIds, addLoadingTodo, removeLoadingTodo } =
    useTodoLoading();

  const {
    tempTodo,
    isAddingTodo,
    newTodoTitle,
    setNewTodoTitle,
    isAllCompleted,
    handleAddTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleToggleAll,
    handleRenameTodo,
    handleClearCompleted,
  } = useTodoActions({
    todoList,
    setTodoList,
    inputRef,
    setError,
    addLoadingTodo,
    removeLoadingTodo,
  });

  const {
    filterByStatus,
    setFilterByStatus,
    filteredTodosList,
    activeTodosCount,
  } = useTodoFilter(todoList);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAddingTodo={isAddingTodo}
          inputRef={inputRef}
          onSubmit={handleAddTodo}
          onToggleAll={handleToggleAll}
          hasTodos={todoList.length > 0}
        />

        <TodoList
          todos={filteredTodosList}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          onToggle={handleToggleTodo}
          onRename={handleRenameTodo}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleRenameTodo}
          />
        )}

        {todoList.length > 0 && (
          <TodoFooter
            todosLeft={activeTodosCount}
            hasCompletedTodos={todoList.some(todo => todo.completed)}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
