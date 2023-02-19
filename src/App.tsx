import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodoOnServer, getTodos, updateTodoOnServer } from './api/todos';
import { filterTodos } from './helpers/filterTodos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';

import { FilterType } from './enums/FilterType';
import { ErrorType } from './enums/ErrorType';
import { OnChangeFunc } from './types/OnChangeFunc';
import { AuthContext } from './contexts/AuthContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [tempTodoTitle, setTempTodoTitle] = useState('');
  const [isAllToggled, setIsAllToggled] = useState(false);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const { id: userId = 0 } = useContext(AuthContext) || {};

  useEffect(() => {
    getTodos(userId)
      .then((userTodos) => setTodos(userTodos))
      .catch(() => {
        setErrorType(ErrorType.Download);
        setIsErrorShown(true);
      });
  }, []);

  const activeTodosNum = useMemo(() => {
    return todos.reduce((num, todo) => {
      return todo.completed ? num : num + 1;
    }, 0);
  }, [todos]);
  const completedTodosNum = todos.length - activeTodosNum;

  const filteredTodos = useMemo(
    () => filterTodos(todos, selectedFilter),
    [selectedFilter, todos],
  );

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setIsErrorShown(true);
  }, []);
  const hideError = useCallback(() => {
    setIsErrorShown(false);
  }, []);

  const onAddTodo = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const onDeleteTodo = useCallback((todoId: number): void => {
    return setTodos((oldTodos) => {
      return oldTodos.filter((todo) => todo.id !== todoId);
    });
  }, []);

  const onChangeTodo: OnChangeFunc = useCallback(
    (todoId, propName, newPropValue): void => {
      setTodos((oldTodos) => {
        return oldTodos.map((todo) => {
          if (todo.id !== todoId) {
            return todo;
          }

          return {
            ...todo,
            [propName]: newPropValue,
          };
        });
      });
    },
    [],
  );

  const onToggleTodosStatus = useCallback(async (): Promise<void> => {
    const todosToToggle = activeTodosNum !== 0
      ? filterTodos(todos, FilterType.Active)
      : filterTodos(todos, FilterType.All);

    setIsAllToggled(true);
    hideError();

    try {
      const todosIds = await Promise.all(
        todosToToggle.map(({ id, completed }) => {
          return updateTodoOnServer(id, { completed: !completed }).then(
            () => id,
          );
        }),
      );

      setTodos((oldTodos) => {
        return oldTodos.map((todo) => {
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
      setIsAllToggled(false);
    }
  }, [todos]);

  const onClearCompleted = useCallback(async (): Promise<void> => {
    const completedTodos = filterTodos(todos, FilterType.Completed);

    setIsClearCompleted(true);
    hideError();

    try {
      const todosIds = await Promise.all(
        completedTodos.map(({ id }) => deleteTodoOnServer(id).then(() => id)),
      );

      setTodos((oldTodos) => {
        return oldTodos.filter((todo) => !todosIds.includes(todo.id));
      });
    } catch {
      showError(ErrorType.Delete);
    } finally {
      setIsClearCompleted(false);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodosNum={activeTodosNum}
          showError={showError}
          hideError={hideError}
          showTempTodo={setTempTodoTitle}
          onAddNewTodo={onAddTodo}
          onToggleTodosStatus={onToggleTodosStatus}
        />

        <TodoList
          todos={filteredTodos}
          activeTodosNum={activeTodosNum}
          tempTodoTitle={tempTodoTitle}
          isClearCompleted={isClearCompleted}
          isAllToggled={isAllToggled}
          showError={showError}
          hideError={hideError}
          onDeleteTodo={onDeleteTodo}
          onChangeTodo={onChangeTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosNum={activeTodosNum}
            completedTodosNum={completedTodosNum}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        isErrorShown={isErrorShown}
        onCloseNotification={hideError}
      />
    </div>
  );
};
