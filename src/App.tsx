import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodo, deleteTodo, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { counterOfActiveTodos, filterTodos } from './helpers/helpers';
import { FilterParam } from './types/FilterParam';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { Error } from './components/Error';
import { Loader } from './Loader';

const USER_ID = 6755;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [filterType, setFilterType] = useState<FilterParam>(FilterParam.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);
  const [isSending, setIsSending] = useState(false);
  const [
    countActiveTodo,
    setCountActiveTodo,
  ] = useState(counterOfActiveTodos(todos));
  const [isToggleAll, setIsToggleAll] = useState(false);
  const [isOnRender, setIsOnRender] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Load);
    }
  };

  const addNewTodo = useCallback((newTodo: Todo): void => {
    setTodos((oldTodos) => [...oldTodos, newTodo]);
  },
  []);

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setHasError(true);
  }, []);

  const hideError = useCallback(() => {
    setHasError(false);
  }, []);

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodo(prevTodo => [...prevTodo, todoId]);

      await deleteTodo(todoId);
      setTodos(todoForDelete => (
        todoForDelete.filter(todo => todo.id !== todoId)
      ));
    } catch {
      setHasError(true);
      showError(ErrorType.Delete);
    } finally {
      setLoadingTodo([0]);
    }
  };

  const addNewTodoInList = async (newTodo: Todo) => {
    if (!isSending) {
      try {
        const downloadNewTodo = await addTodo(USER_ID, newTodo);

        addNewTodo(downloadNewTodo);
      } catch {
        showError(ErrorType.Add);
      } finally {
        setTitle('');
        setTempTodo(null);
        setIsSending(false);
      }
    }
  };

  const handleFormSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      showError(ErrorType.EmptyTitle);
      setTitle('');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
      id: 0,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsSending(true);

    addNewTodoInList(newTodo);
  };

  const updateTodo = async (
    todoId: number,
    completed?: boolean,
    newTitle?: string,
  ) => {
    setLoadingTodo([todoId]);
    try {
      await patchTodo(todoId, completed, newTitle);
      fetchTodos();
    } catch (error) {
      showError(ErrorType.Update);
      setHasError(true);
      setIsOnRender(true);
    } finally {
      setLoadingTodo([0]);
      setIsToggleAll(false);
      setIsOnRender(false);
    }
  };

  const toggleCompletedAllTodo = () => {
    todos.forEach(todo => {
      if (counterOfActiveTodos(todos) > 0) {
        return todo.completed ? todo : updateTodo(todo.id, !todo.completed);
      }

      return updateTodo(todo.id, !todo.completed);
    });

    return setIsToggleAll(true);
  };

  useMemo(() => {
    setCountActiveTodo(counterOfActiveTodos(todos));
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <Loader.Provider value={loadingTodo}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            title={title}
            setTitle={handleTextChange}
            handleFormSubmit={handleFormSubmit}
            toggleCompletedAllTodo={toggleCompletedAllTodo}
            countActiveTodo={countActiveTodo}
            hasTodos={!!todos.length}
          />

          {(todos.length > 0) && (
            <>
              <TodoList
                todos={filterTodos(todos, filterType)}
                removeTodo={removeTodo}
                tempTodo={tempTodo}
                isToggleAll={isToggleAll}
                handleUpdateTodoFormSubmit={updateTodo}
                isOnRender={isOnRender}
              />
              <Footer
                todos={todos}
                filterType={filterType}
                setFilterType={setFilterType}
                removeTodo={removeTodo}
              />
            </>
          )}
        </div>

        {hasError && (
          <Error
            errorType={errorType}
            hasError={hasError}
            onNotificationClose={hideError}
          />
        )}
      </div>
    </Loader.Provider>
  );
};
