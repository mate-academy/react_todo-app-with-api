import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterParam } from './types/FilterParam';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11467;

export const App: React.FC = () => {
  const [filterParam, setFilterParam] = useState(FilterParam.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(true);
  const [title, setTitle] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(createdTodo => {
        setTodos(createdTodo);
        setRequest(false);
      })
      .catch(someError => {
        setError('Unable to load todos');
        setRequest(false);
        // eslint-disable-next-line no-console
        console.warn(someError);
      });
    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setRequest(true);

    todoService
      .createTodo(newTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
        setLoadingTodosIds([]);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
        setLoadingTodosIds([]);
      })
      .finally(() => {
        setRequest(false);
        setTempTodo(null);
      });
    const temp: Todo = Object.assign(newTodo, { id: 0 });

    setTempTodo(temp);
  };

  const deleteTodo = useCallback((id: number) => {
    setLoadingTodosIds([id]);
    setIsLoaderActive(true);

    todoService
      .deleteUserTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setLoadingTodosIds([]);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setLoadingTodosIds([]);
      })
      .finally(() => {
        setLoadingTodosIds([id]);
        setIsLoaderActive(false);
      });
  }, []);

  const updateTodo = (todo: Todo, newTodoTitle: string) => {
    setLoadingTodosIds([todo.id]);
    setIsLoaderActive(true);
    todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setError('Unable to update a todo');
        setLoadingTodosIds([]);
        setIsLoaderActive(false);
      })
      .finally(() => {
        setLoadingTodosIds([todo.id]);
        setIsLoaderActive(false);
      });
  };

  const isOneTodoCompleted = useMemo(
    () => todos.some(({ completed }) => completed),
    [todos],
  );

  const filterTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filterParam) {
        case FilterParam.Active:
          return !completed;
        case FilterParam.Completed:
          return completed;
        default:
          return true;
      }
    });
  }, [todos, filterParam]);

  const handleClearCompleted = async () => {
    const todoToDelete = filterTodos.filter(todo => todo.completed);
    const deletePromises = todoToDelete.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
      setTodos(prevState => prevState.filter(todo => !todo.completed));
    } catch (errorMessage) {
      setError('Unable to delete Todo');
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setLoadingTodosIds(prevTodoId => [...prevTodoId, todo.id]);
    setLoadingTodosIds([todo.id]);
    setIsLoaderActive(true);

    try {
      const updatedTodo = await todoService.updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prevState => prevState.map(currentTodo => (
        currentTodo.id !== updatedTodo.id
          ? currentTodo
          : updatedTodo
      )));
    } catch (errorMessage) {
      setError('Unable to toggle a todo');
      setLoadingTodosIds([]);
      setIsLoaderActive(false);
      throw errorMessage;
    } finally {
      setLoadingTodosIds(prevTodoId_1 => prevTodoId_1
        .filter(id => id !== todo.id));
      setLoadingTodosIds([]);
      setIsLoaderActive(false);
    }
  };

  const isAllTodosCompleted = todos.every(todo => todo.completed);
  const handleToggleAll = async (allTodos: Todo[]) => {
    const isAllTodosTrueOrFalse
      = allTodos.every(todo => todo.completed);

    const uncompletedTodos = allTodos.filter(todo => !todo.completed);

    const changeAllPromises = isAllTodosTrueOrFalse
      ? allTodos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };

        return todoService.updateTodo(updatedTodo);
      })
      : uncompletedTodos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: true,
        };

        return todoService.updateTodo(updatedTodo);
      });

    try {
      const serverTodos = await Promise.all(changeAllPromises);

      setTodos(prevState => {
        return prevState.map(todo => {
          if (serverTodos.some(({ id }) => id === todo.id)) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        });
      });
    } catch (errorMessage) {
      setError('Unable to update todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSubmit={addTodo}
          todo={filterTodos[0] || null}
          userId={USER_ID}
          todos={filterTodos}
          error={error}
          request={request}
          setError={setError}
          setTitle={setTitle}
          title={title}
          setLoadingTodosIds={setLoadingTodosIds}
          onTogle={handleToggleAll}
          isAllCompleted={isAllTodosCompleted}
        />

        <TodoList
          todos={filterTodos}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onTogleTodo={handleToggleTodo}
          loadingTodosIds={loadingTodosIds}
          isLoaderActive={isLoaderActive}
          setLoadingTodosIds={setLoadingTodosIds}
          setIsLoaderActive={setIsLoaderActive}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loadingTodosIds={loadingTodosIds}
            onDelete={deleteTodo}
            isLoaderActive={isLoaderActive}
            onTodoToggle={() => handleToggleTodo(tempTodo)}
          />
        )}

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            isOneTodoCompleted={isOneTodoCompleted}
            filterParam={filterParam}
            setFilterParam={setFilterParam}
            deleteCompletedTodos={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error.trim() },
        )}
      >
        <button
          aria-label="error"
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
