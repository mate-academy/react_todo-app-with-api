/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import {
  getTodos, deleteTodo, patchTodo, addTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { getVisibleTodos } from './utils/helpers';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorMessage/ErrorNotification';
import { Errors } from './types/Errors';

export const USER_ID = 6344;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [numberOfActive, setNumberOfActive] = useState(0);
  const [numberOfCompleted, setNumberOfCompleted] = useState(0);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NO_ERROR);
  const [hasError, setHasErrorMessage] = useState(false);
  const [filterValue, setFilterValue] = useState<Filter>(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodosIds, setProcessingTodosIds] = useState<number[]>([]);

  const showError = useCallback((message: Errors) => {
    setErrorMessage(message);
    setHasErrorMessage(true);
    setTimeout(() => {
      setHasErrorMessage(false);
    }, 3000);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      showError(Errors.LOAD);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const counActive = todos.filter(todo => !todo.completed).length;
    const countCompleted = todos.length - counActive;

    setNumberOfActive(counActive);
    setNumberOfCompleted(countCompleted);
  }, [todos]);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(filterValue, todos)
  ), [filterValue, todos]);

  const handleFilterSelection = useCallback((value:Filter) => {
    setFilterValue(value);
  }, []);

  const handleClearCompleted = async () => {
    try {
      await Promise.all(
        todos.filter(todo => todo.completed).map(todo => {
          setProcessingTodosIds(currentIds => [...currentIds, todo.id]);
          console.log('clickclearcompleted');

          return deleteTodo(todo.id);
        }),
      );
    } catch {
      showError(Errors.DELETE);
    }

    await fetchTodos();
    setProcessingTodosIds([]);
  };

  const handleMultipleToogle = async () => {
    try {
      await Promise.all(
        todos
          .filter(todo => {
            return (numberOfActive) ? !todo.completed : todo.completed;
          })
          .map(({ id, completed }) => {
            setProcessingTodosIds((currentIds) => [...currentIds, id]);

            return patchTodo(id, { completed: !completed });
          }),
      );
    } catch {
      showError(Errors.UPDATE);
    }

    await fetchTodos();
    setProcessingTodosIds([]);
  };

  const handleTodoDeletion = useCallback(async (todoId: number) => {
    setProcessingTodosIds((currentIds) => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
    } catch {
      showError(Errors.DELETE);
    }

    await fetchTodos();
    setProcessingTodosIds([]);
  }, []);

  const handleStatusChange = useCallback(async (
    todoId: number, completed:boolean,
  ) => {
    setProcessingTodosIds((currentIds) => [...currentIds, todoId]);

    try {
      await patchTodo(todoId, { completed: !completed });
    } catch {
      showError(Errors.UPDATE);
    }

    await fetchTodos();
    setProcessingTodosIds([]);
  }, []);

  const handleNewTodoSubmit = useCallback(async (title: string) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      await addTodo(USER_ID, title);
    } catch (error) {
      showError(Errors.ADD);
    }

    await fetchTodos();
    setTempTodo(null);
  }, []);

  const handleTitleUpdate = useCallback(async (
    todoId: number, title: string,
  ) => {
    setProcessingTodosIds((currentIds) => [...currentIds, todoId]);

    try {
      await patchTodo(todoId, { title });
    } catch {
      showError(Errors.UPDATE);
    }

    await fetchTodos();
    setProcessingTodosIds([]);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          numberOfActive={numberOfActive}
          isNoTodos={Boolean(!todos.length)}
          showError={showError}
          onToogle={handleMultipleToogle}
          createTodo={handleNewTodoSubmit}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onTodoDeletion={handleTodoDeletion}
          onStatusChange={handleStatusChange}
          updateTitle={handleTitleUpdate}
          processingTodosIds={processingTodosIds}
        />

        {!!todos.length && (
          <Footer
            currentFilter={filterValue}
            onFilterSelection={handleFilterSelection}
            numberOfActive={numberOfActive}
            numberOfCompleted={numberOfCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}

      </div>

      <ErrorNotification
        isHidden={!hasError}
        message={errorMessage}
        setIsHidden={setHasErrorMessage}
      />

    </div>
  );
};
