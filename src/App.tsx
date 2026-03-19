/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter, FilterStatus } from './components/TodoFooter';
import { TodoService } from './services/todoService';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = React.useState<number[]>([]);
  const [togglingTodoIds, setTogglingTodoIds] = React.useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = React.useState<number[]>([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>(
    FilterStatus.All,
  );

  useEffect(() => {
    TodoService.loadTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.UnableToLoad))
      .finally(() => setLoading(false));
  }, []);

  const onAddTodo = useCallback(async (title: string) => {
    const newTempTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);

    try {
      const addedTodo = await TodoService.addTodo(title);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setTempTodo(null);

      return true;
    } catch (err) {
      if (err instanceof Error && err.message === 'EMPTY_TITLE') {
        setError(ErrorMessage.EmptyTitle);
      } else {
        setError(ErrorMessage.UnableToAdd);
      }

      setTempTodo(null);

      return false;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const onDeleteTodo = useCallback(async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await TodoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorMessage.UnableToDelete);
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  }, []);

  const onClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingTodoIds(prev => [
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]);

    const { successfulIds, hasErrors } =
      await TodoService.deleteCompletedTodos(todos);

    if (hasErrors) {
      setError(ErrorMessage.UnableToDelete);
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );
    setDeletingTodoIds([]);
  }, [todos]);

  const onToggleTodo = useCallback(async (id: number, completed: boolean) => {
    setTogglingTodoIds(prev => [...prev, id]);
    try {
      const updated = await TodoService.toggleTodo(id, completed);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: updated.completed } : todo,
        ),
      );
    } catch {
      setError(ErrorMessage.UnableToUpdate);
    } finally {
      setTogglingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  }, []);

  const onUpdateTitle = useCallback(async (id: number, newTitle: string) => {
    setError(null);
    setUpdatingTodoIds(prev => [...prev, id]);
    let isDeletionError = false;

    try {
      const updated = await TodoService.updateTodoTitle(id, newTitle);

      // If null is returned, it means the title was empty and we should delete
      if (updated === null) {
        setUpdatingTodoIds(prev => prev.filter(todoId => todoId !== id));
        setDeletingTodoIds(prev => [...prev, id]);

        try {
          await TodoService.deleteTodo(id);
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (err) {
          isDeletionError = true;
          setError(ErrorMessage.UnableToDelete);
          setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
          throw err; // Re-throw so TodoItem knows the deletion failed
        }

        return;
      }

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, title: updated.title } : todo,
        ),
      );
    } catch (err) {
      // Only set update error if it's not a deletion error
      if (!isDeletionError) {
        setError(ErrorMessage.UnableToUpdate);
      }

      throw err; // Re-throw so TodoItem knows the update failed
    } finally {
      setUpdatingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  }, []);

  // Auto-hide error notification after 3 seconds
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const { activeTodosCount, completedTodosCount } = useMemo(() => {
    let active = 0;
    let completed = 0;

    for (const todo of todos) {
      if (todo.completed) {
        completed++;
      } else {
        active++;
      }
    }

    return { activeTodosCount: active, completedTodosCount: completed };
  }, [todos]);

  const allCompleted = todos.length > 0 && activeTodosCount === 0;
  const isDeleting = deletingTodoIds.length > 0;

  const onToggleAll = useCallback(async () => {
    const shouldComplete = !allCompleted;
    const todosToToggle = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setTogglingTodoIds(prev => [
      ...prev,
      ...todosToToggle.map(todo => todo.id),
    ]);

    const { updates, hasErrors } = await TodoService.toggleAllTodos(
      todos,
      shouldComplete,
    );

    if (hasErrors) {
      setError(ErrorMessage.UnableToUpdate);
    }

    setTodos(prev =>
      prev.map(todo => {
        const newCompleted = updates.get(todo.id);

        return newCompleted !== undefined
          ? { ...todo, completed: newCompleted }
          : todo;
      }),
    );

    setTogglingTodoIds([]);
  }, [todos, allCompleted]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          allCompleted={allCompleted}
          onAddTodo={onAddTodo}
          isAdding={isAdding}
          isDeleting={isDeleting}
          onToggleAll={onToggleAll}
          hasTodos={todos.length > 0}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            deletingTodoIds={deletingTodoIds}
            togglingTodoIds={togglingTodoIds}
            updatingTodoIds={updatingTodoIds}
            onDeleteTodo={onDeleteTodo}
            onToggleTodo={onToggleTodo}
            onUpdateTitle={onUpdateTitle}
          />
        )}

        {loading && (
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        {tempTodo && (
          <TodoList
            todos={[tempTodo]}
            deletingTodoIds={deletingTodoIds}
            togglingTodoIds={togglingTodoIds}
            updatingTodoIds={updatingTodoIds}
            addingTodoId={tempTodo.id}
            onDeleteTodo={onDeleteTodo}
            onToggleTodo={onToggleTodo}
            onUpdateTitle={onUpdateTitle}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
