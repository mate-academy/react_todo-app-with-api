import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import classNames from 'classnames';
import {
  addTodo,
  changeTodo,
  getTodos,
  removeTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorsType } from './types/ErrorsType';

import { filterTodos } from './utils/helpers/filterBySort';

import { UserWarning } from './UserWarning';
import { HeaderTodo } from './components/HeaderTodo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';

const USER_ID = 7036;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setSortType] = useState<FilterType>(FilterType.ALL);
  const [errorType, setErrorType] = useState<ErrorsType>(ErrorsType.EMPTY);
  const [isHiddenError, setIsHiddenError] = useState(true);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const handleError = useCallback((typeOfError: ErrorsType) => {
    setErrorType(typeOfError);
    setIsHiddenError(false);

    setTimeout(() => {
      setIsHiddenError(true);
      // setErrorType(ErrorsType.NONE);
    }, 3000);
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
      } catch {
        handleError(ErrorsType.UPDATE);
      }
    };

    fetchTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    filterTodos(todos, filterType)
  ), [todos, filterType]);

  const onlyUncompletedTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const hasCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const addNewTodo = useCallback(async (title: string, id: number) => {
    if (!title.trim()) {
      handleError(ErrorsType.EMPTY);

      return;
    }

    const normalizedTitle = title.trim();

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id,
    });

    try {
      const addingTodo = await addTodo(newTodo);

      setTodos(prevTodos => ([
        ...prevTodos,
        addingTodo,
      ]));
    } catch {
      handleError(ErrorsType.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handlerSortType = useCallback((type: FilterType) => {
    setSortType(type);
  }, []);

  const handleCloseError = () => {
    setIsHiddenError(true);
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodosIds(prevLoaderIds => ([
        ...prevLoaderIds,
        todoId,
      ]));

      await removeTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todoId !== todo.id));
    } catch {
      handleError(ErrorsType.DELETE);
    } finally {
      setLoadingTodosIds(prevLoaderIds => (
        prevLoaderIds.filter(id => id !== todoId)
      ));
    }
  }, []);

  const handleRemoveAllCompletedTodo = useCallback(async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await Promise.all(completedTodosIds.map(handleDeleteTodo));
  }, [todos]);

  const handlerTodoToggle = useCallback(async (
    id: number,
    completed: boolean,
  ) => {
    try {
      setLoadingTodosIds(prevLoaderIds => ([
        ...prevLoaderIds,
        id,
      ]));

      await changeTodo(id, { completed: !completed });

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !completed };
        }

        return todo;
      }));
    } catch {
      handleError(ErrorsType.UPDATE);
    } finally {
      setLoadingTodosIds(prevLoaderIds => (
        prevLoaderIds.filter(prevLoaderId => id !== prevLoaderId)
      ));
    }
  }, []);

  const handlerToggleAll = useCallback(async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosIds = areAllCompleted
      ? todos.map(todo => todo.id)
      : todos.filter(todo => !todo.completed).map(todo => todo.id);

    await Promise.all(
      todosIds.map(id => handlerTodoToggle(id, areAllCompleted)),
    );
  }, [todos]);

  const handlerChangeTitle = useCallback(async (
    newTitle: string,
    todoId: number,
  ) => {
    const title = newTitle.trim();

    if (!title) {
      await handleDeleteTodo(todoId);

      return;
    }

    try {
      setLoadingTodosIds(prevLoadIds => ([
        ...prevLoadIds,
        todoId,
      ]));

      await changeTodo(todoId, { title });

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, title: newTitle };
        }

        return todo;
      }));
    } catch {
      handleError(ErrorsType.UPDATE);
    } finally {
      setLoadingTodosIds(prevLoaderIds => (
        prevLoaderIds.filter(prevLoaderId => todoId !== prevLoaderId)
      ));
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <HeaderTodo
            todos={todos}
            onAddTodo={addNewTodo}
            onToogleAll={handlerToggleAll}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          idsForLoader={loadingTodosIds}
          onCompleted={handlerTodoToggle}
          onChangeTitle={handlerChangeTitle}
        />

        {todos[0] && (
          <TodoFooter
            todos={onlyUncompletedTodos}
            filterType={filterType}
            onSelect={handlerSortType}
            onClearCompleted={handleRemoveAllCompletedTodo}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: isHiddenError,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleCloseError}
          aria-label="delete error message"
        />

        {errorType}
      </div>
    </div>
  );
};
