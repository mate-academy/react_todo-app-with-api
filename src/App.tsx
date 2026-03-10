import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';

// type Errors = 'upload' | 'title' | 'add' | 'delete' | 'update' | '';
enum Errors {
  Upload = 'upload',
  Title = 'title',
  Add = 'add',
  Delete = 'delete',
  Update = 'update',
  None = '',
}

enum FiltersParam {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadTodos, setLoadTodos] = useState<boolean>(false);
  const [hasError, setHasError] = useState<Errors>(Errors.None);
  const [filter, setFilter] = useState<FiltersParam>(FiltersParam.All);
  // const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  // const [allTodosCount, setAllTodosCount] = useState<number>(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [processings, setProcessings] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [errorTimestamp, setErrorTimestamp] = useState(0);
  const [updateLoad, setUpdateLoad] = useState(false);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FiltersParam.Completed:
        return todos.filter(t => t.completed);
      case FiltersParam.Active:
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedTodos = useMemo(() => todos.filter(t => t.completed), [todos]);
  const allTodosCount = useMemo(() => todos.length, [todos]);

  function showError(error: Errors) {
    setHasError(error);
    setErrorTimestamp(Date.now());
  }

  useEffect(() => {
    setLoadTodos(true);
    setHasError(Errors.None);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(error => {
        setHasError(Errors.Upload);
        throw error;
      })
      .finally(() => {
        setLoadTodos(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onCreateTodo(title: string) {
    setIsSubmitting(true);
    setHasError(Errors.None);

    const newTemp = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTemp);

    addTodos(newTemp)
      .then((created: Todo | Todo[]) => {
        const createdTodo: Todo | undefined = Array.isArray(created)
          ? created[0]
          : created;

        if (!createdTodo) {
          setHasError(Errors.Add);

          return;
        }

        setTodos(prev => [...prev, createdTodo]);
        setTodoTitle('');
        // setAllTodosCount(prev => prev + 1);
      })
      .catch(error => {
        setHasError(Errors.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  }

  function onDeleteTodo(id: number) {
    setProcessings(prev => [...prev, id]);

    return deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        // setAllTodosCount(prev => prev - 1);
        setFocusTrigger(prev => prev + 1);
      })
      .catch(error => {
        setHasError(Errors.Delete);
        throw error;
      })
      .finally(() => {
        setProcessings(prev => prev.filter(pid => pid !== id));
      });
  }

  function onDeleteCompletedTodos() {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    const promises = completedIds.map(id => {
      setProcessings(prev => [...prev, id]);

      return deleteTodos(id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== id));
          // setAllTodosCount(prev => prev - 1);
          // setCompletedTodos(prev => prev.filter(t => t.id !== id)); // ← оновлюємо completedTodos
          setFocusTrigger(prev => prev + 1);
        })
        .catch(() => {
          return Promise.reject(id);
        })
        .finally(() => {
          setProcessings(prev => prev.filter(pid => pid !== id));
        });
    });

    Promise.allSettled(promises).then(results => {
      if (results.some(r => r.status === 'rejected')) {
        setHasError(Errors.Delete);
      }
    });
  }

  function onUpdateTodo(id: number, title?: string) {
    setHasError(Errors.None);
    setProcessings(prev => [...prev, id]);
    setUpdateLoad(true);
    const selected = todos.find(todo => todo.id === id);

    if (selected) {
      const updated: Todo = title
        ? { ...selected, title: title !== undefined ? title : selected.title }
        : { ...selected, completed: !selected.completed };

      return updateTodos(updated)
        .then((updatedTodo: Todo) => {
          setTodos(prev =>
            prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
          );
        })
        .catch(error => {
          setHasError(Errors.Update);
          throw error;
        })
        .finally(() => {
          setUpdateLoad(false);
          setProcessings(prev => prev.filter(pid => pid !== id));
        });
    }
  }

  function onToggleHandle() {
    const allCompleted = todos.every(t => t.completed);
    const targetCompleted = !allCompleted;
    const toUpdate = todos.filter(t => t.completed !== targetCompleted);

    if (toUpdate.length === 0) {
      return;
    }

    const toUpdateIds = toUpdate.map(t => t.id);

    setProcessings(prev => [...prev, ...toUpdateIds]); // ✅ використовуємо існуючий стан

    const requests = toUpdate.map(t =>
      updateTodos({ ...t, completed: targetCompleted }),
    );

    Promise.all(requests)
      .then(updatedTodosArray => {
        const updatedMap = new Map(updatedTodosArray.map(u => [u.id, u]));

        setTodos(prev => prev.map(t => updatedMap.get(t.id) ?? t));
        // setCompletedTodos(
        //   todos.map(t => updatedMap.get(t.id) ?? t).filter(t => t.completed),
        // );
      })
      .catch(() => {
        setHasError(Errors.Update); // ✅ показує помилку при 503
      })
      .finally(() => {
        setProcessings(prev => prev.filter(id => !toUpdateIds.includes(id))); // ✅ прибираємо loading
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          allTodosCount={allTodosCount}
          completedCount={completedTodos.length}
          todoTitle={todoTitle}
          setTodoTitle={(newTitle: string) => setTodoTitle(newTitle)}
          onCreateTodo={(title: string) => onCreateTodo(title)}
          setHasError={(error: Errors) => setHasError(error)}
          isSubmitting={isSubmitting}
          focusTrigger={focusTrigger}
          onToggleHandle={onToggleHandle}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processings={processings}
          updateLoad={updateLoad}
          onDeleteTodo={(id: number) => onDeleteTodo(id)}
          onUpdateTodo={(id: number, title?: string) => onUpdateTodo(id, title)}
        />

        <TodoFooter
          allTodosCount={allTodosCount}
          todoLeft={allTodosCount - completedTodos.length}
          filter={filter}
          setFilter={(newFilter: FiltersParam) => setFilter(newFilter)}
          onDeleteCompletedTodos={onDeleteCompletedTodos}
        />
      </div>

      <ErrorNotification
        hasError={hasError}
        loadTodos={loadTodos}
        errorTimestamp={errorTimestamp}
        setHasError={showError}
      />
    </div>
  );
};
