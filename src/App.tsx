/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './Components/TodoList';
import {
  Actions,
  DispatchContext,
  StateContext,
} from './Components/Store';
import { TodosType } from './enums/TodosType';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const {
    allTodos,
    error,
  } = useContext(StateContext);
  const activeTodos = useMemo(() => {
    return allTodos?.filter(todo => !todo.completed) || [];
  }, [allTodos]);
  const completedTodos = useMemo(() => {
    return allTodos?.filter(todo => todo.completed) || [];
  }, [allTodos]);
  const [visibleTodosType, setVisibleTodosType] = useState(TodosType.all);
  const [errorMessage, setErrorMessage] = useState(error);
  const USER_ID = 12123;
  const ErrorClases = 'notification is-danger '
    + 'is-light has-text-weight-normal';
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  useEffect(() => {
    dispatch({
      type: Actions.setNewUserId,
      userId: USER_ID,
    });
  }, [USER_ID, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    switch (visibleTodosType) {
      case TodosType.active:
        return allTodos.filter(todo => !todo.completed) || [];
      case TodosType.completed:
        return allTodos.filter(todo => todo.completed) || [];
      default:
        return allTodos;
    }
  }, [allTodos, visibleTodosType]);

  const handleErrorCanceling = () => {
    setErrorMessage('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          completedTodos={completedTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
        />

        <TodoList todos={visibleTodos} tempTodo={tempTodo} />

        {!!allTodos.length && (
          <Footer
            completedTodos={completedTodos}
            activeTodos={activeTodos}
            setErrorMessage={setErrorMessage}
            visibleTodosType={visibleTodosType}
            setVisibleTodosType={setVisibleTodosType}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(ErrorClases, {
          hidden: !errorMessage,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorCanceling}
        />
        <p>{errorMessage}</p>
        {/* Title should not be empty */}
        {/* Unable to add a todo */}
        {/* Unable to delete a todo */}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
