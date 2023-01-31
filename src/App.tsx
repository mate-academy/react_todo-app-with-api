/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useState,
} from 'react';
import { getTodos } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage';
import { TodosFilter } from './components/TodosFilter';
import { Header } from './components/Header';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { ErrorType } from './types/ErrorType';
import { TodoList } from './components/TodoList';
import { useTodoChange } from './customHooks/useTodoChange';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);
  const [idOfChangingTodos, isTodosChanging, setTodoChange] = useTodoChange();
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filterTodos = useCallback(
    (filteredTodos: Todo[]) => {
      setVisibleTodos(filteredTodos);
    }, [visibleTodos],
  );

  const onChangeError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setIsError(true);
  }, [errorType]);

  const onTodosChange = useCallback(
    (currentStatus: boolean, idOfTodo: number | number[]) => {
      setTodoChange(idOfTodo, currentStatus);
    }, [idOfChangingTodos],
  );

  const addTempTodo = useCallback(
    (tempTodotoAdd: Todo | null) => {
      setTempTodo(tempTodotoAdd);
    }, [tempTodo],
  );

  useEffect(() => {
    if (!isTodosChanging) {
      getTodos((user as User).id)
        .then(result => {
          setTodosFromServer(result);
          setVisibleTodos(result);
          setTodoChange(-1, false);
          setTempTodo(null);
        })
        .catch(() => {
          setErrorType(ErrorType.LOAD);
          setIsError(true);
        });
    }
  }, [tempTodo, isTodosChanging]);

  const hideError = useCallback(
    () => {
      setIsError(false);
      setTimeout(() => {
        setErrorType(ErrorType.NONE);
      }, 1500);
    }, [],
  );

  useEffect(() => {
    if (errorType !== ErrorType.NONE) {
      setTimeout(() => {
        hideError();
      }, 3000);
    }
  }, [errorType]);

  const areTodosEmpty = !todosFromServer.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        onChange={onTodosChange}
        onError={onChangeError}
        isTodosChanging={isTodosChanging}
        onAddTempTodo={addTempTodo}
        todos={todosFromServer}
      />

      <div className="todoapp__content">
        {(!areTodosEmpty || tempTodo) && (
          <>
            <TodoList
              todosToShow={visibleTodos}
              changingTodoIds={idOfChangingTodos}
              onTodoAction={setTodoChange}
              onError={onChangeError}
              temptodo={tempTodo}
            />
            <TodosFilter
              usersTodos={todosFromServer}
              onFilter={filterTodos}
              onDeleteCompleted={setTodoChange}
              onError={onChangeError}
            />
          </>
        )}
      </div>
      <ErrorMessage
        isError={isError}
        onHideError={hideError}
        errorType={errorType}
      />
    </div>
  );
};
