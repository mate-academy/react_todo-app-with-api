import React, {
  useCallback, useEffect, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer';
import { Main } from './components/main';
import { ErrorNotification } from './components/errorNotification';
import { Header } from './components/header';
import { Todo } from './types/Todo';
import { SelectOptions } from './types/SelectOptions';
import { ErrorType } from './types/ErrorType';
import {
  deleteTodos, getTodos, postTodos, patchTodoStatus,
} from './api/todos';
import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.ADD);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isResponce, setIsResponce] = useState(true);
  const [todoLoadingId, setTodoLoadingId] = useState<number[]>([]);
  // const [selectedOption, setSelectedOption]
  //   = useState<SelectOptions>(SelectOptions.ALL);

  const filteredCompletedTodosId = useCallback((allTodos: Todo[]) => () => {
    return allTodos
      .filter((todo: Todo) => todo.completed)
      .map(todoItem => todoItem.id);
  }, []);

  const filterTodosBySelectOptions = (type: SelectOptions) => {
    switch (type) {
      case SelectOptions.ACTIVE:
        setVisibleTodos(todos.filter((todo: Todo) => !todo.completed));
        break;
      case SelectOptions.COMPLETED:
        setVisibleTodos(todos.filter((todo: Todo) => todo.completed));
        break;
      case SelectOptions.ALL:
      default:
        setVisibleTodos(todos);
    }
  };

  // const setOptionSelect = (type: SelectOptions) => {
  //   setSelectedOption(type);
  //   filterTodosBySelectOptions(type);
  // };

  const loadTodosFromServer = useCallback(async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
      setVisibleTodos(todosData);
      setCompletedTodosId(filteredCompletedTodosId(todosData));
    } catch (err) {
      setIsError(true);
    }
  }, []);

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
      setIsResponce(false);
      const postNewTodo = await postTodos(todoToPost);

      if (postNewTodo) {
        setTodos(prevState => ([...prevState, postNewTodo]));
        setVisibleTodos(prevState => ([...prevState, postNewTodo]));
      }
    } catch {
      setErrorType(ErrorType.ADD);
      setIsError(true);
    } finally {
      setIsResponce(true);
      setTempTodo(null);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setIsResponce(false);
      const deleteExistTodo = await deleteTodos(todoId);

      if (deleteExistTodo) {
        setTodos(prevState => {
          return prevState.filter(todo => todo.id !== todoId);
        });
        setTodoLoadingId([-1]);
      }
    } catch {
      setErrorType(ErrorType.DELETE);
      setIsError(true);
    } finally {
      setIsResponce(true);
    }
  }, []);

  useEffect(() => {
    loadTodosFromServer();
  }, [todoLoadingId]);

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

  // const addComplitedTodo = () => {
  //   const completed = filteredCompletedTodosId(todos);

  //   setCompletedTodosId(completed);
  //   console.log('3');
  // };

  // const updateTodoStatus = (todoId:number, todoStatus: boolean) => {
  //   const todoToUpdate = todos.find(todo => todo.id === todoId);

  //   console.log('2');
  //   if (todoToUpdate) {
  //     todoToUpdate.completed = todoStatus;
  //     // setVisibleTodos(prevTodos => [...prevTodos, todoToUpdate]);
  //     addComplitedTodo(todoId);
  //     // setOptionSelect(selectedOption);
  //   }
  // };

  const patchTodoStatusOnServer = async (
    todoId: number, todoStatus: boolean,
  ) => {
    try {
      setIsResponce(false);
      setTodoLoadingId([todoId]);
      const currentTodo = todos.find(todo => todo.id === todoId);

      const responce = await patchTodoStatus(todoId, { completed: todoStatus });

      if (responce && currentTodo) {
        currentTodo.completed = todoStatus;

        setTodos(prevState => (
          prevState.map(todo => (
            todo.id === todoId
              ? currentTodo
              : todo
          ))
        ));
      }
    } catch {
      setErrorType(ErrorType.UPDATE);
      setIsError(true);
    } finally {
      setIsResponce(true);
      setTodoLoadingId([-1]);
    }
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
      setTodoLoadingId([-1]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAddTodo={addTodo} inputDisable={isResponce} />

        {!!todos.length
          && (
            <Main
              todos={visibleTodos}
              addComplitedTodo={addComplitedTodo}
              onTodoChangingStatus={patchTodoStatusOnServer}
              onTodoDelete={deleteTodo}
              todoLoadingId={todoLoadingId}
              tempTodo={tempTodo}
            />
          )}

        {!!todos.length
          && (
            <Footer
              filterTodos={filterTodosBySelectOptions}
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
