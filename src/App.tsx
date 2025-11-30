import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { TodoItem, TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client, Filter, TodoError } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fetchTodos() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTodos();

        if (!mounted) {
          return;
        }

        setTodos(data || []);
      } catch {
        if (!mounted) {
          return;
        }

        setError(TodoError.Load);
      } finally {
        if (!mounted) {
          return;
        }

        setLoading(false);
      }
    }

    fetchTodos();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const id = window.setTimeout(() => setError(null), 3000);

    return () => clearTimeout(id);
  }, [error]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Filter.All) {
        return true;
      }

      if (filter === 'active') {
        return !todo.completed;
      }

      return todo.completed;
    });
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos],
  );

  const handleAdd = useCallback(async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError(TodoError.EmptyTitle);

      return false;
    }

    setError(null);

    const temp: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    try {
      const created = await client.post<Todo>('/todos', {
        title: trimmed,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, created]);

      setTempTodo(null);
      setFocusTrigger(n => n + 1);

      return true;
    } catch (e) {
      setError(TodoError.Add);
      setTempTodo(null);

      return false;
    } finally {
      setTimeout(() => setTempTodo(null), 200);
    }
  }, []);

  const handleUpdate = useCallback(
    async (id: Todo['id'], title: string): Promise<boolean> => {
      setBusyIds(prev => ({ ...prev, [String(id)]: true }));
      setError(null);
      try {
        const updated = await client.patch<Todo>(`/todos/${id}`, { title });

        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));

        return true;
      } catch (e) {
        setError(TodoError.Update);

        return false;
      } finally {
        setBusyIds(prev => {
          const copy = { ...prev };

          delete copy[String(id)];

          return copy;
        });
      }
    },
    [],
  );

  const handleDelete = useCallback(async (id: Todo['id']): Promise<boolean> => {
    setBusyIds(prev => ({ ...prev, [String(id)]: true }));
    setError(null);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
      setFocusTrigger(n => n + 1);

      return true;
    } catch (event) {
      setError(TodoError.Delete);

      return false;
    } finally {
      setBusyIds(prev => {
        const copy = { ...prev };

        delete copy[String(id)];

        return copy;
      });
    }
  }, []);

  const handleToggle = useCallback(
    async (id: Todo['id'], completed: boolean) => {
      setBusyIds(prev => ({ ...prev, [String(id)]: true }));
      setError(null);
      try {
        const updated = await client.patch<Todo>(`/todos/${id}`, { completed });

        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
      } catch (e) {
        setError(TodoError.Update);
      } finally {
        setBusyIds(prev => {
          const copy = { ...prev };

          delete copy[String(id)];

          return copy;
        });
      }
    },
    [],
  );

  const handleToggleAll = useCallback(async () => {
    const allCompleted = todos.length > 0 && todos.every(t => t.completed);
    const desired = !allCompleted;

    setError(null);

    const targets = todos.filter(t => t.completed !== desired).map(t => t.id);

    if (targets.length === 0) {
      return;
    }

    setBusyIds(prev => {
      const copy = { ...prev };

      targets.forEach(id => {
        copy[String(id)] = true;
      });

      return copy;
    });

    const results = await Promise.allSettled(
      targets.map(id =>
        client.patch<Todo>(`/todos/${id}`, { completed: desired }),
      ),
    );

    const successfulUpdated: Todo[] = results
      .map((r, i) => ({ r, id: targets[i] }))
      .filter(x => x.r.status === 'fulfilled')
      .map(x => (x.r as PromiseFulfilledResult<Todo>).value);

    if (successfulUpdated.length > 0) {
      setTodos(prev =>
        prev.map(t => {
          const found = successfulUpdated.find(u => u.id === t.id);

          return found ? found : t;
        }),
      );
    }

    const failed = results.filter(r => r.status === 'rejected');

    if (failed.length > 0) {
      setError(TodoError.Update);
    }

    setBusyIds(prev => {
      const copy = { ...prev };

      targets.forEach(id => delete copy[String(id)]);

      return copy;
    });
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    const ids = todos.filter(t => t.completed).map(t => t.id);

    if (ids.length === 0) {
      return;
    }

    setError(null);

    setBusyIds(prev => {
      const copy = { ...prev };

      ids.forEach(id => (copy[String(id)] = true));

      return copy;
    });

    const results = await Promise.allSettled(
      ids.map(id => client.delete(`/todos/${id}`)),
    );

    const failed = results
      .map((r, i) => ({ result: r, id: ids[i] }))
      .filter(x => x.result.status === 'rejected')
      .map(x => x.id);

    setFocusTrigger(n => n + 1);

    setTodos(prev =>
      prev.filter(t => !ids.includes(t.id) || failed.includes(t.id)),
    );

    if (failed.length > 0) {
      setError(TodoError.Delete);
    }

    setBusyIds(prev => {
      const copy = { ...prev };

      ids.forEach(id => delete copy[String(id)]);

      return copy;
    });
  }, [todos]);

  const onSetFilter = (next: Filter) => {
    setFilter(next);
  };

  const toggleAllActive = todos.length > 0 && todos.every(t => t.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          toggleAllActive={toggleAllActive}
          onToggleAll={handleToggleAll}
          adding={!!tempTodo}
          onAdd={handleAdd}
          focusTrigger={focusTrigger}
          todos={todos}
        />

        <TodoList
          todos={visibleTodos}
          loading={loading}
          busyIds={busyIds}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        {tempTodo && <TodoItem todo={tempTodo} loading={true} />}
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onSetFilter={onSetFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>
      <Notification error={error} onHide={() => setError(null)} />
    </div>
  );
};
