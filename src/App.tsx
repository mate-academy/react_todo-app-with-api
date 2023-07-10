/* eslint-disable max-len */
import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './Footer/Footer';
import { Main } from './Main/Main';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';
import { Header } from './Header/Header';
import { Todo } from './types/Todo';
import { SelectOptions } from './types/SelectOptions';
import { ErrorType } from './types/ErrorType';
import {
  deleteTodos, getTodos, postTodos, patchTodoStatus, patchTodoTitle,
} from './api/todos';
import { USER_ID } from './utils/userId';
import { filterTodosBySelectOptions } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.ADD);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isResponse, setIsResponse] = useState(true);
  const [todoLoadingId, setTodoLoadingId] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOptions>(SelectOptions.ALL);

  const getCompletedTodosId = useCallback((allTodos: Todo[]) => () => {
    return allTodos
      .filter((todo: Todo) => todo.completed)
      .map(todoItem => todoItem.id);
  }, []);

  const setOptionSelect = (type: SelectOptions) => {
    setSelectedOption(type);
  };

  const loadTodosFromServer = useCallback(async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
      setCompletedTodosId(getCompletedTodosId(todosData));
    } catch (err) {
      setIsError(true);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodosBySelectOptions(todos, selectedOption);
  }, [todos, selectedOption]);

  const emptyTodo = useCallback((title = '') => {
    const emptyNewTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(emptyNewTodo);
  }, []);

  const postTodoOnServer = useCallback(async (
    todoToPost: Pick<Todo, 'userId' | 'title' | 'completed'>,
  ) => {
    try {
      emptyTodo(todoToPost.title);
      setIsResponse(false);
      const postNewTodo = await postTodos(todoToPost);

      if (postNewTodo) {
        setTodos(prevState => ([...prevState, postNewTodo]));
      }
    } catch {
      setErrorType(ErrorType.ADD);
      setIsError(true);
    } finally {
      setIsResponse(true);
      setTempTodo(null);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setIsResponse(false);
      const deleteExistTodo = await deleteTodos(todoId);

      if (deleteExistTodo) {
        setTodos(prevState => {
          return prevState.filter(todo => todo.id !== todoId);
        });
        setTodoLoadingId([]);
      }
    } catch {
      setErrorType(ErrorType.DELETE);
      setIsError(true);
    } finally {
      setIsResponse(true);
    }
  }, []);

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => clearTimeout(timeoutID);
  }, [isError]);

  const closeNotification = () => {
    setIsError(false);
  };

  const addComplitedTodo = (todoId:number) => {
    const currentTodo = todos.find(todo => todo.id === todoId);

    if (currentTodo) {
      if (!completedTodosId.includes(todoId)) {
        setCompletedTodosId(prevState => ([...prevState, todoId]));
      } else {
        setCompletedTodosId(prevState => {
          return prevState.filter(id => id !== todoId);
        });
      }
    }
  };

  const patchTodoStatusOnServer = async (todoId: number) => {
    try {
      setIsResponse(false);
      const currentTodo = todos.find(todo => todo.id === todoId);

      if (currentTodo) {
        const newStatus = !currentTodo.completed;

        const responce = await patchTodoStatus(todoId, {
          completed: newStatus,
        });

        if (responce) {
          currentTodo.completed = newStatus;
          setTodos(prevState => (
            prevState.map(todo => (
              todo.id === todoId
                ? currentTodo
                : todo
            ))
          ));
        }
      }
    } catch {
      setErrorType(ErrorType.UPDATE);
      setIsError(true);
    } finally {
      setIsResponse(true);
      setTodoLoadingId([]);
    }
  };

  const updateTodoStatus = (todoId: number) => {
    setTodoLoadingId([todoId]);
    patchTodoStatusOnServer(todoId);
  };

  const addTodo = (todo: Pick<Todo, 'userId' | 'title' | 'completed' >) => {
    if (!todo.title.trim()) {
      setErrorType(ErrorType.ADD);
      setIsError(true);

      return;
    }

    postTodoOnServer(todo);
  };

  const deleteTodo = (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      setErrorType(ErrorType.DELETE);
      setIsError(true);

      return;
    }

    setTodoLoadingId([todoId]);
    deleteTodoFromServer(todoId);
  };

  const deleteCompletedTodos = async () => {
    try {
      setTodoLoadingId(completedTodosId);
      await Promise.all(
        completedTodosId.map(id => deleteTodos(id)),
      );

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setIsError(true);
      setErrorType(ErrorType.DELETE);
    } finally {
      setTodoLoadingId([]);
    }
  };

  const isToggleAllActive = completedTodosId.length < 1
    || completedTodosId.length === todos.length;

  const onActiveToggle = async () => {
    if (isToggleAllActive) {
      setTodoLoadingId(todos.map(todo => todo.id));
      await Promise.all(todos.map(
        todo => patchTodoStatusOnServer(todo.id),
      ));
    }
  };

  const patchTodoTitleOnServer = async (
    todoId: number, newTitle: string,
  ) => {
    try {
      setIsResponse(false);
      const currentTodo = todos.find(todo => todo.id === todoId);

      if (currentTodo) {
        const responce = await patchTodoTitle(todoId, {
          title: newTitle,
        });

        if (responce) {
          currentTodo.title = newTitle;
          setTodos(prevState => (
            prevState.map(todo => (
              todo.id === todoId
                ? currentTodo
                : todo
            ))
          ));
        }
      }
    } catch {
      setErrorType(ErrorType.UPDATE);
      setIsError(true);
    } finally {
      setIsResponse(true);
      setTodoLoadingId([]);
    }
  };

  const updateTodoTitle = (todoId: number, title: string) => {
    setTodoLoadingId([todoId]);
    patchTodoTitleOnServer(todoId, title);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={addTodo}
          inputDisable={isResponse}
          isToggleAllActive={isToggleAllActive}
          handleToggleClick={onActiveToggle}
        />

        {!!todos.length
          && (
            <Main
              todos={visibleTodos}
              addComplitedTodo={addComplitedTodo}
              onTodoChangingStatus={updateTodoStatus}
              onTodoDelete={deleteTodo}
              onTodoChangingTitle={updateTodoTitle}
              todoLoadingId={todoLoadingId}
              tempTodo={tempTodo}
            />
          )}

        {!!todos.length
          && (
            <Footer
              filterTodos={setOptionSelect}
              todosCount={todos.length}
              completedTodosCount={completedTodosId.length}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          )}
      </div>

      {isError && (
        <ErrorNotification
          onNotificationClose={closeNotification}
          isErrorOccuring={isError}
          errorTypeToShow={errorType}
        />
      )}
    </div>
  );
};
