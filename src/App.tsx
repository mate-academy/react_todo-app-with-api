import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterByStatus } from './types/FilterByStatus';
import { ErrorTypes } from './types/PossibleError';
import { getTodos, removeTodo, updateTodoOnServer } from './api/todos';
import {
  isCompleted,
  activeTodosLength,
  clearNotification,
  filterTodos,
} from './utils/functions';
import { UserIdContext } from './utils/context';
import { ChangeTodo } from './types/ChangeTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredByStatus, setFilteredByStatus]
  = useState<FilterByStatus>(FilterByStatus.All);
  const [possibleError, setPossibleError]
  = useState<ErrorTypes>(ErrorTypes.None);
  const [tempTodoName, setTempTodoName] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const userId = useContext(UserIdContext);

  const getTodosFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch (error) {
      setPossibleError(ErrorTypes.Download);
      clearNotification(setPossibleError, 3000);
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filteredByStatus),
    [filteredByStatus, todos],
  );

  const showError = useCallback((error: ErrorTypes) => {
    setPossibleError(error);
  }, []);

  const hideError = useCallback(() => {
    setPossibleError(ErrorTypes.None);
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

  const changeTodo: ChangeTodo = useCallback((
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
  }, []);

  const toggleStatus = useCallback(async () => {
    const filterByType = !activeTodosLength
      ? FilterByStatus.All
      : FilterByStatus.Active;
    const toggleTodos = filterTodos(todos, filterByType);

    setIsToggled(true);
    hideError();

    try {
      const todosAllId = await Promise.all(
        toggleTodos.map(async ({ id, completed }) => {
          await updateTodoOnServer(id, { completed: !completed });

          return id;
        }),
      );

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (!todosAllId.includes(todo.id)) {
            return todo;
          }

          return {
            ...todo,
            completed: !todo.completed,
          };
        });
      });
    } catch {
      showError(ErrorTypes.Update);
    } finally {
      setIsToggled(false);
    }
  }, [todos]);

  const onClearCompleted = useCallback(async () => {
    const finishedTodos = filterTodos(todos, FilterByStatus.Completed);

    setIsClearCompleted(true);
    hideError();

    try {
      const todosAllId = await Promise.all(
        finishedTodos.map(({ id }) => removeTodo(id).then(() => id)),
      );

      setTodos((prevTodos) => {
        return prevTodos.filter(({ id }) => !todosAllId.includes(id));
      });
    } catch {
      showError(ErrorTypes.Delete);
    } finally {
      setIsClearCompleted(false);
    }
  }, [todos]);

  const ativeTodosQuantity = activeTodosLength(todos);
  const isTodosCompleted = isCompleted(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          activeTodosQuantity={ativeTodosQuantity}
          showTempTodo={setTempTodoName}
          addNewTodo={addNewTodo}
          showError={showError}
          toggleStatus={toggleStatus}
        />

        <TodoList
          todos={filteredTodos}
          tempTodoName={tempTodoName}
          deleteTodo={deleteTodo}
          changeTodo={changeTodo}
          isClearCompleted={isClearCompleted}
          showError={showError}
          hideError={hideError}
          isToggled={isToggled}
          activeTodosQuantity={ativeTodosQuantity}
        />

        {todos.length && (
          <Footer
            activeTodosQuantity={ativeTodosQuantity}
            isTodosCompleted={isTodosCompleted}
            filteredByStatus={filteredByStatus}
            setFilteredByStatus={setFilteredByStatus}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        possibleError={possibleError}
        onErrorNotificationClose={hideError}
      />
    </div>
  );
};
