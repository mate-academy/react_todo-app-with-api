import { useEffect } from 'react';
import { getTodosStats } from './utils/getTodosStats';
import { useTodosState } from './hooks/useTodosState';
import { usePendingTodos } from './hooks/usePendingTodos';
import { useTempTodo } from './hooks/useTempTodo';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { useInputRef } from './hooks/useInputRef';
import { useError } from './hooks/useError';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoList } from './components/TodoList';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo, UpdateTodoDto } from './types/Todo';
import { StatusError } from './types/Error';

export const App = () => {
  const { todos, loadTodos, createTodo, removeTodo, updateTodo } =
    useTodosState();
  const { tempTodo, createTempTodo, removeTempTodo } = useTempTodo();
  const { pendingTodoIds, addPendingTodo, removePendingTodo } =
    usePendingTodos();
  const { filter, setFilter, filteredTodos } = useFilteredTodos(todos);
  const { inputRef, focusInput, disableInput, enableInput } = useInputRef();
  const { errorMessage, setErrorMessage, clearErrorMessage } = useError();

  const { hasTodos, activeTodosCount, hasCompletedTodos, allTodosCompleted } =
    getTodosStats(todos);

  useEffect(() => {
    loadTodos().catch(() => setErrorMessage(StatusError.GET));
  }, [loadTodos, setErrorMessage]);

  const handleCreateTodo = async (title: string) => {
    clearErrorMessage();
    createTempTodo(title);
    disableInput();
    try {
      await createTodo(title);
    } catch (error) {
      setErrorMessage(StatusError.POST);
      throw error;
    } finally {
      removeTempTodo();
      enableInput();
      focusInput();
    }
  };

  const handleRemoveTodo = async (id: Todo['id']) => {
    clearErrorMessage();
    addPendingTodo(id);
    try {
      await removeTodo(id);
    } catch {
      setErrorMessage(StatusError.DELETE);
    } finally {
      removePendingTodo(id);
      focusInput();
    }
  };

  const handleUpdateTodo = async (id: Todo['id'], data: UpdateTodoDto) => {
    clearErrorMessage();
    addPendingTodo(id);
    try {
      await updateTodo(id, data);
    } catch (error) {
      setErrorMessage(StatusError.UPDATE);
      throw error;
    } finally {
      removePendingTodo(id);
    }
  };

  const handleRemoveCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await Promise.all(completedTodoIds.map(id => handleRemoveTodo(id)));
  };

  const handleToggleComplete = async () => {
    await Promise.all(
      todos
        .filter(todo => todo.completed === allTodosCompleted)
        .map(todo => handleUpdateTodo(todo.id, { completed: !todo.completed })),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          inputRef={inputRef}
          hasTodos={hasTodos}
          allCompleted={allTodosCompleted}
          onToggle={handleToggleComplete}
          onCreate={handleCreateTodo}
          onError={setErrorMessage}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          pendingTodoIds={pendingTodoIds}
          onRemove={handleRemoveTodo}
          onUpdate={handleUpdateTodo}
        />

        {hasTodos && (
          <TodoAppFooter
            hasCompletedTodos={hasCompletedTodos}
            activeTodosCount={activeTodosCount}
            filter={filter}
            onSelectFilter={setFilter}
            onRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={clearErrorMessage}
      />
    </div>
  );
};
