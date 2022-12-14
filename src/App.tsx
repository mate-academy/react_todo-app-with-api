/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoData,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ProcessedContext } from './components/ProcessedContext/ProcessedContext';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotiication';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes } from './types/ErrorTypes';
import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const {
    setError,
    setIsAdding,
    setProcessedTodoIds,
  } = useContext(ProcessedContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredBy, setFiltredBy] = useState(FilterOptions.ALL);

  const getUserTodos = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setError(ErrorTypes.GET);
      }
    }
  };

  const addNewTodo = async (todo: TodoData) => {
    try {
      setError(ErrorTypes.NONE);
      setIsAdding(true);
      const tempTodo = { ...todo, id: 0 };

      setTodos(prevTodos => [...prevTodos, tempTodo]);

      await createTodo(todo);
    } catch {
      setError(ErrorTypes.ADD);
    } finally {
      setIsAdding(false);
      getUserTodos();
    }
  };

  const deleteCurrentTodo = async (todoId: number) => {
    try {
      setError(ErrorTypes.NONE);
      setProcessedTodoIds((currentIDs) => [...currentIDs, todoId]);

      await deleteTodo(todoId);
      setTodos(currentTodos => {
        return currentTodos.filter(todo => todoId !== todo.id);
      });
    } catch {
      setError(ErrorTypes.DELETE);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const updateCurrentTodo = async (
    todoId: number,
    dataToUpdate: Partial<Todo>,
  ) => {
    try {
      setError(ErrorTypes.NONE);
      setProcessedTodoIds((currentIDs) => [...currentIDs, todoId]);
      setTodos((currentTodos) => {
        const updatedTodo = currentTodos.find(el => el.id === todoId) || null;

        if (updatedTodo) {
          Object.assign(updatedTodo, dataToUpdate);
        }

        return currentTodos;
      });

      await updateTodo(todoId, dataToUpdate);
    } catch {
      setError(ErrorTypes.UPDATE);
    } finally {
      await getUserTodos();
      setProcessedTodoIds([]);
    }
  };

  useEffect(() => {
    getUserTodos();
  }, []);

  const filterBySelect = useCallback((
    todosFromServer: Todo[],
    option: string,
  ) => {
    return todosFromServer.filter(todo => {
      switch (option) {
        case FilterOptions.ACTIVE:
          return todo.completed === false;

        case FilterOptions.COMPLETED:
          return todo.completed === true;

        case FilterOptions.ALL:
        default:
          return true;
      }
    });
  }, []);

  const visibleTodos = useMemo(() => {
    return filterBySelect(todos, filtredBy);
  }, [todos, filtredBy]);

  const activeTodos = useMemo(() => {
    return filterBySelect(todos, FilterOptions.ACTIVE);
  }, [todos]);

  const isClearNeeded = useMemo(() => {
    return activeTodos.length !== visibleTodos.length;
  }, [activeTodos, visibleTodos]);

  const clearCompletedTodos = async () => {
    const compTodos = todos
      .filter(todo => todo.completed);

    await Promise.all(compTodos
      .map((todo) => deleteCurrentTodo(todo.id)));
  };

  const toggleAll = async () => {
    const todosToUpdate = activeTodos.length === 0
      ? todos
      : activeTodos;

    await Promise.all(todosToUpdate
      .map((todo) => {
        return updateCurrentTodo(todo.id, { completed: !todo.completed });
      }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: activeTodos.length === 0 },
            )}
            onClick={toggleAll}
          />

          <NewTodoForm onAdd={addNewTodo} />
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={deleteCurrentTodo}
              onUpdate={updateCurrentTodo}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <TodoFilter
                filtredBy={filtredBy}
                onOptionChange={setFiltredBy}
              />
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className={classNames(
                  'todoapp__clear-completed',
                  { hidden: !isClearNeeded },
                )}
                onClick={clearCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
