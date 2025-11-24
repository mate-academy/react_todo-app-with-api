import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.ALL);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const addTodo = async (title: string) => {
    setError(null);

    try {
      const newTodo = await createTodo(title);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setError('Unable to add a todo');
      throw new Error('Unable to add a todo');
    }
  };

  const deleteTodoItem = async (id: number) => {
    setError(null);
    setLoadingIds(current => [...current, id]);

    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
      throw new Error('Unable to delete a todo');
    } finally {
      setLoadingIds(current => current.filter(loadingId => loadingId !== id));
    }
  };

  const toggleTodo = async (todo: Todo) => {
    setError(null);
    setLoadingIds(current => [...current, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setLoadingIds(current =>
        current.filter(loadingId => loadingId !== todo.id),
      );
    }
  };

  const renameTodo = async (todo: Todo, title: string) => {
    setError(null);
    setLoadingIds(current => [...current, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, { title });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setLoadingIds(current =>
        current.filter(loadingId => loadingId !== todo.id),
      );
    }
  };

  const toggleAll = async () => {
    setError(null);
    setIsUpdating(true);

    const areAllCompleted = todos.every(todo => todo.completed);

    try {
      const promises = todos.map(todo => {
        if (todo.completed === areAllCompleted) {
          return updateTodo(todo.id, { completed: !areAllCompleted });
        }

        return Promise.resolve(todo);
      });

      const updatedTodos = await Promise.all(promises);

      setTodos(updatedTodos);
    } catch {
      setError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCompleted = async () => {
    setError(null);
    setIsUpdating(true);

    const completedTodos = todos.filter(todo => todo.completed);

    try {
      const promises = completedTodos.map(todo => deleteTodo(todo.id));

      await Promise.all(promises);
      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete a todo');
      throw new Error('Unable to delete a todo');
    } finally {
      setIsUpdating(false);
    }
  };

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );
  const allCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAddTodo={addTodo} onError={setError} />
        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodoItem}
          onToggle={toggleTodo}
          onRename={renameTodo}
          isLoading={id => loadingIds.includes(id)}
          isUpdating={isUpdating}
          allCompleted={allCompleted}
          onToggleAll={toggleAll}
        />
        {todos.length > 0 && (
          <Footer
            filterBy={filterBy}
            onFilterBy={setFilterBy}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={deleteCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onError={setError} />
    </div>
  );
};
