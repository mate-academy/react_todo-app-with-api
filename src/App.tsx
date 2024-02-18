import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { addTodos, deleteTodos, getTodos, patchTodo } from './api/todos';

const USER_ID = 27;

export const filterTodos = (currentTodos: Todo[], query: Filter) => {
  return currentTodos.filter(todo => {
    switch (query) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default:
        return todo;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.UnableToLoadAll));
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter, filterTodos]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed !== true).length;
  }, [todos]);

  const isCompletedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed === true).length > 0;
  }, [todos]);

  const addNewTodo = useCallback((title: string) => {
    if (!title.trim()) {
      setError(Error.NoTitle);

      return;
    }

    const temp = {
      title,
      id: 0,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setError(null);

    addTodos(temp)
      .then(res => {
        setTodos(prev => [...prev, res]);
      })
      .catch(() => setError(Error.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const deleteCurrentTodo = useCallback((id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);
    deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completedTodoIds);

    Promise.all(completedTodoIds.map(id => deleteTodos(id)))
      .then(() => {
        setTodos(prev =>
          prev.filter(todo => !completedTodoIds.includes(todo.id)),
        );
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }, [todos]);

  const allCompleted = todos.every(todo => todo.completed);

  const toggleAllTodos = () => {
    if (allCompleted) {
      const loadingTodosIds = todos.map(todo => todo.id);

      setLoadingTodoIds(loadingTodosIds);

      const activeTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      const patchPromises = todos.map(todo =>
        patchTodo(todo.id, { ...todo, completed: false }),
      );

      Promise.all(patchPromises)
        .then(() => {
          setTodos(activeTodos);
        })
        .catch(() => setError(Error.UnableToUpdate))
        .finally(() => setLoadingTodoIds([]));

      return;
    }

    const loadingTodosIds = todos
      .filter(todo => !todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(loadingTodosIds);

    const completedTodos = todos.map(todo => ({
      ...todo,
      completed: true,
    }));

    const patchPromises = todos.map(todo =>
      patchTodo(todo.id, { ...todo, completed: true }),
    );

    Promise.all(patchPromises)
      .then(() => {
        setTodos(completedTodos);
      })
      .catch(() => setError(Error.UnableToUpdate))
      .finally(() => setLoadingTodoIds([]));
  };

  const updateTodo = (id: number, data: Partial<Todo>) => {
    setLoadingTodoIds(prev => [...prev, id]);
    patchTodo(id, data)
      .then(() => {
        setTodos(prev =>
          prev.map(todo => {
            if (todo.id === data.id) {
              return { ...todo, ...data };
            }

            return todo;
          }),
        );
      })
      .catch(() => setError(Error.UnableToUpdate))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          addTempTodo={addNewTodo}
          disabled={!!tempTodo}
          toggleAllTodos={toggleAllTodos}
          allCompleted={allCompleted}
          todos={todos}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodos={deleteCurrentTodo}
          loadingTodoIds={loadingTodoIds}
          updateTodo={updateTodo}
        />
        <Footer
          filterTodos={setFilter}
          currentFilter={filter}
          isCompletedTodos={isCompletedTodos}
          activeTodosCount={activeTodosCount}
          deleteCompletedTodos={deleteCompletedTodos}
          todos={todos}
        />
      </div>
      {error && <ErrorMessage error={error} close={() => setError(null)} />}
    </div>
  );
};
