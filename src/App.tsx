import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/header';
import { TodoList } from './components/todos';
import { Error } from './components/error';
import { Filter } from './components/filter';
import { FilterOptions } from './types/FilterOptions';
import { UpdateTodoArgs } from './types/UpdateTodoArgs';

const USER_ID = 10995;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [
    filterMethod,
    setFilterMethod,
  ] = useState<FilterOptions>(FilterOptions.ALL);
  const [isHidden, setIsHidden] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setError('Error: cannot upload todos'));
  }, []);

  useEffect(() => {
    let errorTimer: number;
    let hiddenTime: number;

    if (error) {
      hiddenTime = window.setTimeout(() => {
        setIsHidden(true);
      }, 2000);
      errorTimer = window.setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(hiddenTime);
    };
  }, [error]);

  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  const visibleTodos: Todo[] = useMemo(() => {
    switch (filterMethod) {
      case FilterOptions.ACTIVE:
        return activeTodos;

      case FilterOptions.COMPLETED:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filterMethod]);

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add todo');
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const deleteComplededTodos = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
    } catch {
      setError('Unable to delete todos');
    }
  };

  const toggleTodo = async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    try {
      setLoadingTodos((prevState) => [...prevState, todoId]);

      await updateTodo(todoId, args);

      setTodos((prevState) => prevState.map(todo => {
        return (todo.id === todoId)
          ? {
            ...todo,
            completed: !todo.completed,
          }
          : todo;
      }));
    } catch (err) {
      setError(`${err}`);
    } finally {
      setLoadingTodos(
        (prevState) => prevState.filter((id => id !== todoId)),
      );
    }
  };

  const toggleAllTodos = async () => {
    const hasUncompletedTodos = todos.some((todo) => !todo.completed);

    let actionTodos: Todo[] = [];

    actionTodos = !hasUncompletedTodos
      ? completedTodos
      : activeTodos;

    actionTodos.forEach(async todoToUpdate => {
      await toggleTodo(todoToUpdate.id,
        { completed: !todoToUpdate.completed });
    });
  };

  const todosLength = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          toggleAllTodos={toggleAllTodos}
          setError={setError}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          setTodos={setTodos}
          setError={setError}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {todosLength}
              {' '}
              {todosLength === 1 ? 'item left' : 'items left'}
            </span>

            <Filter filter={filterMethod} setFilter={setFilterMethod} />

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={deleteComplededTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}

        {(error) && (
          <Error error={error} setError={setError} isHidden={isHidden} />
        )}
      </div>
    </div>
  );
};
