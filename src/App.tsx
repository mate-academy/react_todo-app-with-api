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
import { PossibleError } from './types/PossibleError';
import { getTodos, removeTodo, updateTodoOnServer } from './api/todos';
import {
  completedTodosLength,
  activeTodosLength,
  filterTodos,
} from './utils/functions';
import { UserIdContext } from './utils/context';
import { ChangeTodo } from './types/ChangeTodo';

// const USER_ID = 6383;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredByStatus, setFilteredByStatus]
  = useState<FilterByStatus>(FilterByStatus.All);
  const [possibleError, setPossibleError]
  = useState<PossibleError>(PossibleError.None);
  const [tempTodoName, setTempTodoName] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const userId = useContext(UserIdContext);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setPossibleError(PossibleError.Download);
      }
    };

    getTodosFromServer();
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filteredByStatus),
    [filteredByStatus, todos],
  );

  const showError = useCallback((error: PossibleError) => {
    setPossibleError(error);
  }, []);

  const hideError = useCallback(() => {
    setPossibleError(PossibleError.None);
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
      showError(PossibleError.Update);
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
      showError(PossibleError.Delete);
    } finally {
      setIsClearCompleted(false);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          activeTodosLength={activeTodosLength(todos)}
          showTempTodo={setTempTodoName}
          createNewTodo={addNewTodo}
          showError={showError}
          hideError={hideError}
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
          activeTodosLength={activeTodosLength(todos)}
        />

        {todos.length && (
          <Footer
            activeTodosLength={activeTodosLength(todos)}
            completedTodosLength={completedTodosLength(todos)}
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
