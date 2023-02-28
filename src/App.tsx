/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { UserIdContext } from './contexts/AuthContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectFilter, setSelectFilter] = useState<FilterType>(FilterType.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [tempTodoTitle, setTempTodoTitle] = useState('');
  const [isAllToggled, setIsAllToggled] = useState(false);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const userId = useContext(UserIdContext);

  const userTodos = async () => {
    try {
      const loadedTodos = await getTodos(userId);

      setTodos(loadedTodos);
    } catch (error) {
      setErrorType(ErrorType.Download);
    }
  };

  useEffect(() => {
    userTodos();
  }, []);

  const activeTodosNum = useMemo(
    () => filterTodos(todos, FilterType.Active).length,
    [todos],
  );

  const counterCompletedTodos = todos.length - activeTodosNum;

  const filteredTodos = useMemo(() => filterTodos(todos, selectFilter),
    [selectFilter, todos]);

  const handleShowError = useCallback((error: ErrorType) => {
    setErrorType(error);
  }, []);

  const handleHideError = useCallback(() => {
    setErrorType(ErrorType.None);
  }, []);

  const handleAddTodo = useCallback(
    (newTodo: Todo) => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const handleDeleteTodo = useCallback((todoId: number) => {
    setTodos((oldTodos) => {
      return oldTodos.filter(({ id }) => id !== todoId);
    });
  }, []);

  const handleChangeTodo: OnChangeFunc = useCallback(
    (todoId, propName, newPropValue) => {
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

  const handleToggleTodosStatus = useCallback(async () => {
    const filterType = activeTodosNum === 0
      ? FilterType.All
      : FilterType.Active;
    const todosToToggle = filterTodos(todos, filterType);

    setIsAllToggled(true);
    handleHideError();

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
      handleShowError(ErrorType.Update);
    } finally {
      setIsAllToggled(false);
    }
  }, [todos]);

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = filterTodos(todos, FilterType.Completed);

    setIsClearCompleted(true);
    handleHideError();

    try {
      const todosIds = await Promise.all(
        completedTodos.map(({ id }) => deleteTodoOnServer(id).then(() => id)),
      );

      setTodos((oldTodos) => {
        return oldTodos.filter(({ id }) => !todosIds.includes(id));
      });
    } catch {
      handleShowError(ErrorType.Delete);
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
          showError={handleShowError}
          hideError={handleHideError}
          showTempTodo={setTempTodoTitle}
          onAddNewTodo={handleAddTodo}
          onToggleTodosStatus={handleToggleTodosStatus}
        />

        <TodoList
          todos={filteredTodos}
          activeTodosNum={activeTodosNum}
          tempTodoTitle={tempTodoTitle}
          isClearCompleted={isClearCompleted}
          isAllToggled={isAllToggled}
          showError={handleShowError}
          hideError={handleHideError}
          onDeleteTodo={handleDeleteTodo}
          onChangeTodo={handleChangeTodo}
        />

        {!!todos.length && (
          <TodoFooter
            activeTodosNum={activeTodosNum}
            counterCompletedTodos={counterCompletedTodos}
            selectFilter={selectFilter}
            onSelectFilter={setSelectFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        onCloseNotification={handleHideError}
      />
    </div>
  );
};
