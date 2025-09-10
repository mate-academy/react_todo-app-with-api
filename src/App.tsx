/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './utils/preferences';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
  };

  const {
    todos,
    tempTodo,
    processedIds,
    setProcessedIds,
    isAdding,
    isLoading,
    newTodoField,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleTodo,
    handleToggleAll,
    setTodos,
    inputValue,
    setInputValue,
  } = useTodos(showError);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const allVisibleTodos = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleRenameTodo = async (todo: Todo) => {
    const trimmed = editingTitle.trim();

    if (!trimmed) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      setEditingId(null);

      return;
    }

    setProcessedIds(prev => [...prev, todo.id]);
    await new Promise(resolve => setTimeout(resolve, 0));
    try {
      const updated = await updateTodo(todo.id, { title: trimmed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      setEditingId(null);
    } catch {
      showError(ErrorMessage.Update);
    } finally {
      setProcessedIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          isLoading={isLoading}
          todos={todos}
          completedTodosCount={completedTodosCount}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onAdd={handleAddTodo}
          onToggleAll={handleToggleAll}
          newTodoField={newTodoField}
          isAdding={isAdding}
          showError={showError}
        />

        <TodoList
          todos={allVisibleTodos}
          editingId={editingId}
          editingTitle={editingTitle}
          processedIds={processedIds}
          tempTodo={tempTodo}
          isAdding={isAdding}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onStartEditing={startEditing}
          onRename={handleRenameTodo}
          setEditingTitle={setEditingTitle}
          setEditingId={setEditingId}
        />

        {todos.length > 0 && (
          <TodoFooter
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.Default)}
      />
    </div>
  );
};
