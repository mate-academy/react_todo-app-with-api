import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import {
  addTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Filter } from './types/enums/filter';
import { Error } from './types/Error';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';

const USER_ID = 12156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => {
        setTodos(res);
      })
      .catch(() => setError(Error.UnableToLoadAll));
  }, []);

  const filterTodos = useCallback((currentTodos: Todo[], query: Filter) => {
    return currentTodos.filter(todo => {
      switch (query) {
        case Filter.All:
          return todo;
        case Filter.Completed:
          return todo.completed;
        case Filter.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter, filterTodos]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isCompletedTodos = useMemo(() => {
    return todos
      .filter(todo => todo.completed === true).length > 0;
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

    addTodo(temp)
      .then(res => {
        setTodos(prev => [
          ...prev,
          res,
        ]);
      })
      .catch(() => setError(Error.UnableToAdd))
      .finally(() => setTempTodo(null));
  }, []);

  const deleteCurrentTodo = useCallback((id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }, []);

  const updateTodo = (id: number, data: Partial<Todo>) => {
    setLoadingTodoIds(prev => [...prev, id]);
    patchTodo(id, data)
      .then(() => {
        setTodos(prev => prev.map(todo => {
          if (todo.id === data.id) {
            return { ...todo, ...data };
          }

          return todo;
        }));
      }).catch(() => setError(Error.UnableToUpdate))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const allCompleted = todos.every(todo => todo.completed);

  const toggleAllTodos = () => {
    if (allCompleted) {
      const loadingTodosIds = todos
        .map(todo => todo.id);

      setLoadingTodoIds(loadingTodosIds);

      const activeTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      const patchPromises = todos
        .map(todo => patchTodo(todo.id, { ...todo, completed: false }));

      Promise.all(patchPromises)
        .then(() => {
          setTodos(activeTodos);
        })
        .catch(() => setError(Error.UnableToUpdate))
        .finally(() => setLoadingTodoIds([]));

      return;
    }

    const loadingTodosIds = todos.filter(todo => !todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(loadingTodosIds);

    const completedTodos = todos.map(todo => ({
      ...todo,
      completed: true,
    }));

    const patchPromises = todos
      .map(todo => patchTodo(todo.id, { ...todo, completed: true }));

    Promise.all(patchPromises)
      .then(() => {
        setTodos(completedTodos);
      })
      .catch(() => setError(Error.UnableToUpdate))
      .finally(() => setLoadingTodoIds([]));
  };

  const clearCompletedTodos = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completedTodoIds);

    const deletePromises = completedTodoIds
      .map(todoId => deleteTodo(todoId));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => setLoadingTodoIds([]));
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
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteCurrentTodo}
          loadingTodoIds={loadingTodoIds}
          updateTodo={updateTodo}
        />
        <Footer
          filterTodos={setFilter}
          isCompletedTodos={isCompletedTodos}
          activeTodosCount={activeTodosCount}
          filter={filter}
          clearCompletedTodos={clearCompletedTodos}
        />
        {error && <ErrorMessage error={error} close={() => setError(null)} />}
      </div>
    </div>
  );
};
