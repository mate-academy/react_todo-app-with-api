import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { getTodos, removeTodo, updateTodo } from './api/todos';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer/Footer';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorType } from './types/ErrorType';
import { UserContext } from './UserContext';
import {
  activeTodosAmount,
  clearNotification,
  filterTodos,
  isDone,
} from './helpers';
import { EditTodo } from './types/EditTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterByStatus, setFilterByStatus]
    = useState<FilterStatus>(FilterStatus.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [tempTodoName, setTempTodoName] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const userId = useContext(UserContext);

  const getTodosFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorType(ErrorType.Load);
      clearNotification(setErrorType, 3000);
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filterByStatus),
    [filterByStatus, todos],
  );

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
  }, []);

  const hideError = useCallback(() => {
    setErrorType(ErrorType.None);
  }, []);

  const addNewTodo = useCallback(
    (newTodo: Todo) => setTodos((prevTodos) => [...prevTodos, newTodo]),
    [],
  );

  const deleteTodo = useCallback((todoId: number) => {
    setTodos((prevTodos) => {
      return prevTodos.filter(({ id }) => id !== todoId);
    });
  }, []);

  const editTodo: EditTodo = useCallback((
    todoId, name, newValue,
  ) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          [name]: newValue,
        };
      });
    });
  },
  []);

  const toggleStatus = useCallback(async () => {
    const filterType = !activeTodosAmount
      ? FilterStatus.All
      : FilterStatus.Active;
    const toggleTodos = filterTodos(todos, filterType);

    setIsToggled(true);
    hideError();

    try {
      const todosIds = await Promise.all(
        toggleTodos.map(async ({ id, completed }) => {
          await updateTodo(id, { completed: !completed });

          return id;
        }),
      );

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (!todosIds.includes(todo.id)) {
            return todo;
          }

          return {
            ...todo,
            completed: !todo.completed,
          };
        });
      });
    } catch {
      showError(ErrorType.Update);
    } finally {
      setIsToggled(false);
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    const completedTodos = filterTodos(todos, FilterStatus.Completed);

    setIsClearCompleted(true);
    hideError();

    try {
      const todosIds = await Promise.all(
        completedTodos.map(({ id }) => removeTodo(id).then(() => id)),
      );

      setTodos((prevTodos) => {
        return prevTodos.filter(({ id }) => !todosIds.includes(id));
      });
    } catch {
      showError(ErrorType.Delete);
    } finally {
      setIsClearCompleted(false);
    }
  }, [todos]);

  const activeTodosQuantity = activeTodosAmount(todos);
  const isTodosDone = isDone(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosQuantity={activeTodosQuantity}
          showError={showError}
          showTempTodo={setTempTodoName}
          addNewTodo={addNewTodo}
          toggleStatus={toggleStatus}
        />

        <TodoList
          todos={filteredTodos}
          activeTodosQuantity={activeTodosQuantity}
          tempTodoName={tempTodoName}
          showError={showError}
          hideError={hideError}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          isClearCompleted={isClearCompleted}
          isToggled={isToggled}
        />

        {!!todos.length && (
          <Footer
            activeTodosQuantity={activeTodosQuantity}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            onClearCompleted={clearCompleted}
            isTodosDone={isTodosDone}
          />
        )}
      </div>

      {errorType && (
        <ErrorNotification
          errorType={errorType}
          onNotificationClose={hideError}
        />
      )}
    </div>
  );
};
