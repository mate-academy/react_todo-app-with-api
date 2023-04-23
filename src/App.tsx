import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { TodoFilter } from './components/TodoFilter';
import { Loader } from './components/Loader';
import { Error } from './components/Error';
import { TodoForm } from './components/TodoForm';

const USER_ID = 6925;

export const App: React.FC = () => {
  const [errorMessage, setErrorMesage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isInputDisabled, setIsDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds]
    = useState<Set<number>>(new Set());

  const addLoadingTodo = useCallback((id: number) => {
    setLoadingTodosIds(state => {
      state.add(id);

      return new Set(state);
    });
  }, []);

  const removeLoadingTodo = useCallback((id: number) => {
    setLoadingTodosIds(state => {
      state.delete(id);

      return new Set(state);
    });
  }, []);

  const setError = useCallback((message: string) => {
    setErrorMesage(message);
    setHasError(true);
    setTimeout(() => setHasError(false), 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    setIsloading(true);
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setError('Unable to load todos');
    } finally {
      setIsloading(false);
    }
  }, []);

  const sendTodo = useCallback(async (todo: Omit<Todo, 'id'>) => {
    setIsDisableInput(true);
    try {
      const todoFromServer: Todo = await postTodo(USER_ID, todo);

      setTodos(state => [...state, todoFromServer]);
    } catch (error) {
      setError('Unable to add a todo');
    } finally {
      setIsDisableInput(false);
      setTempTodo(null);
    }
  }, []);

  const removeTodo = async (todoId: number) => {
    addLoadingTodo(todoId);
    try {
      await deleteTodo(USER_ID, todoId);
      setTodos(todoList => todoList.filter(({ id }) => id !== todoId));
    } catch (error) {
      setError('Unable to delete a todo');
    } finally {
      removeLoadingTodo(todoId);
    }
  };

  const updatedTodos = (todoList: Todo[], todo: Todo) => (
    todoList.map(todoTask => {
      if (todo.id === todoTask.id) {
        return todo;
      }

      return todoTask;
    }));

  const updateTodo = async (todo: Todo) => {
    addLoadingTodo(todo.id);
    try {
      const updatedTodo = await patchTodo(USER_ID, todo);

      setTodos(currentTodos => updatedTodos(currentTodos, updatedTodo));
    } catch (error) {
      setError('Unable to update a todo');
    } finally {
      removeLoadingTodo(todo.id);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    setHasError(false);
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterType, todos]);

  const activeTodosCount = todos.reduce((count, todo) => (
    count + Number(!todo.completed)
  ), 0);

  const handleTodoAdding = (title: string) => {
    setHasError(false);
    if (!title) {
      setError('Title can not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    sendTodo(newTodo);

    setTempTodo({ ...newTodo, id: 0 });
  };

  const handleDeleteTodo = (id: number) => {
    setHasError(false);
    removeTodo(id);
  };

  const handleClearCompleted = () => {
    setHasError(false);
    todos.forEach(({ completed, id }) => {
      if (completed) {
        removeTodo(id);
      }
    });
  };

  const updateTodoProperty = (id: number, property: Partial<Todo>) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate) {
      const updatedTodo = {
        ...todoToUpdate,
        ...property,
      };

      updateTodo(updatedTodo);
    }
  };

  const handleStatusChange = (id: number, completed: boolean) => {
    setHasError(false);

    updateTodoProperty(id, { completed });
  };

  const handleCompleteAllTasks = () => {
    setHasError(false);
    todos.forEach(({ completed, id }) => {
      if (activeTodosCount === 0 || !completed) {
        updateTodoProperty(id, { completed: !completed });
      }
    });
  };

  const handleTodoUpdate = (id: number, title: string) => {
    setHasError(false);
    updateTodoProperty(id, { title });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="toggle"
            type="button"
            onClick={handleCompleteAllTasks}
            className={classNames('todoapp__toggle-all', {
              active: !activeTodosCount,
            })}
          />

          <TodoForm
            onSubmit={handleTodoAdding}
            disabled={isInputDisabled}
          />
        </header>

        {todos && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            loadingIds={loadingTodosIds}
            onStatusChange={handleStatusChange}
            updateTodo={handleTodoUpdate}
          />
        )}

        {isLoading && <Loader />}

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}

      </div>

      <Error
        errorMessage={errorMessage}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
