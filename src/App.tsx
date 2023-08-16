import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodoRequest,
  getTodos,
  updateTodoRequest,
} from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoItem } from './components/TodoItem';
import { FilterOptions } from './types/FilterOptions';

const USER_ID = 10919;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.all);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllTodosCompleted = todos.every(todo => todo.completed);
  const countIncompleteTodos = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterOptions.active:
        return todos.filter(todo => !todo.completed);
      case FilterOptions.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addNewTodo = useCallback(async (newTitle:string) => {
    try {
      const newTodo = {
        title: newTitle,
        userId: USER_ID,
        completed: false,
      };

      const createdTodo = await createTodo(USER_ID, newTodo);

      setTempTodo({
        id: 0,
        title: newTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos((prevTodos) => [
        ...prevTodos,
        createdTodo,
      ]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId:number) => {
    try {
      setLoadingTodoIds((currentIds) => [...currentIds, todoId]);

      const isDeleted = await deleteTodoRequest(todoId);

      if (isDeleted) {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      }
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds((currentIds) => (
        currentIds.filter((id) => id !== todoId)
      ));
    }
  }, []);

  const clearCompletedTodos = useCallback(() => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoIds.forEach(async (todoId) => {
      await deleteTodo(todoId);
    });
  }, [deleteTodo, todos]);

  const updateTodo = async (
    todoId:number,
    newData:Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    try {
      setLoadingTodoIds((currentIds) => [...currentIds, todoId]);

      const updatedTodo = await updateTodoRequest(todoId, newData);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds((currentIds) => (
        currentIds.filter((id) => id !== todoId)
      ));
    }
  };

  const checkAllTodos = useCallback(() => {
    todos.forEach(async (todo) => {
      await updateTodo(
        todo.id,
        { completed: !areAllTodosCompleted },
      );
    });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          addNewTodo={addNewTodo}
          loadingTodoIds={loadingTodoIds}
          hasCompletedTodos={hasCompletedTodos}
          areAllTodosCompleted={areAllTodosCompleted}
          checkAlltodos={checkAllTodos}
        />

        {todos && (
          <TodoList
            todos={visibleTodos}
            loadingTodoIds={loadingTodoIds}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            setError={setError}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            setError={setError}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${countIncompleteTodos} items left`}
            </span>

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

            <button
              type="button"
              className={cn({
                'todoapp__clear-completed': hasCompletedTodos,
                'todoapp__clear-hidden': !hasCompletedTodos,
              })}
              onClick={clearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {error && (
        <Notification error={error} setError={setError} />
      )}
    </div>
  );
};
