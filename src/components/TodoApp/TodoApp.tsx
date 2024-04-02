import React, { useContext, useMemo, useRef } from 'react';
import { Header } from '../Header/Header';
import { UserWarning } from '../../UserWarning';
import { USER_ID } from '../../api/todos';
import { DispatchContext, StateContext } from '../../Store';
import { TodoList } from '../TodoList/TodoList';
import { Footer } from '../Footer/Footer';
import classNames from 'classnames';

export const TodoApp: React.FC = () => {
  const { todos, errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const timer = useRef(0);

  timer.current = window.setTimeout(
    () => dispatch({ type: 'setError', message: '' }),
    3000,
  );

  const unCompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleOnClickDelete = () => {
    clearTimeout(timer.current);
    dispatch({ type: 'setError', message: '' });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header unCompletedTodos={unCompletedTodos} />
        {!!todos.length && (
          <>
            <TodoList />
            <Footer unCompletedTodos={unCompletedTodos} />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleOnClickDelete}
        />
        {errorMessage}
      </div>
    </div>
  );
};
