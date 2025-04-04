import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const userId = 1878;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddTodo = async (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 1000);
      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await createTodo(newTodo);
      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleUpdateTodo = async (
    todoId: number,
    updates: Partial<Todo>,
  ): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, updates);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleMarkAllAsCompleted = async (completed: boolean): Promise<void> => {
    const idsToUpdate = todos
      .filter(todo => todo.completed !== completed)
      .map(todo => todo.id);

    if (idsToUpdate.length === 0) return;

    setLoadingTodoIds(prev => [...prev, ...idsToUpdate]);

    try {
      const updatedTodos = await Promise.all(
        todos.map(todo => {
          if (todo.completed !== completed) {
            return updateTodo(todo.id, { completed });
          }

          return Promise.resolve(todo);
        })
      );

      setTodos(updatedTodos);
    } catch {
      setError('Unable to update all todos');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const clearCompleted = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(
        completedTodos.map(todo =>
          deleteTodo(todo.id).catch(() =>
            setError('Unable to delete some todos'),
          ),
        ),
      );
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError('Error clearing completed todos');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const areAnyCompleted = todos.some(todo => todo.completed);

  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && (
        <div className="todo-loader" data-cy="TodoLoader">
          <span>Loading...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <Header
            onAddTodo={handleAddTodo}
            onMarkAllAsCompleted={handleMarkAllAsCompleted}
            areAllCompleted={areAllCompleted}
            shouldShowMarkAllButton={!areAnyCompleted}
          />
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDeleteTodo={handleDeleteTodo}
            onUpdateTodo={handleUpdateTodo}
            loadingTodoIds={loadingTodoIds}
            onAddTodo={handleAddTodo}
          />
          {todos.length !== 0 && todos.length && (
            <Footer
              filter={filter}
              setFilter={setFilter}
              todosCount={todos.filter(todo => !todo.completed).length}
              completedTodosCount={completedTodosCount}
              clearCompleted={clearCompleted}
            />
          )}
        </>
      )}

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
