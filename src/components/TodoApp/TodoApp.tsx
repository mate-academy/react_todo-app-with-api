/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from '../../UserWarning';
import { TodoList } from '../TodoList';
import { USER_ID } from '../../constants/user';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Error } from '../Error';
import { TodoContext } from '../../context/TodoContext';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  const activeTodosCount = todos.reduce((acc, cur) => {
    if (!cur.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const completedTodosIds = todos
    .filter(({ completed }) => completed)
    .map(({ id }) => id);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {(!!todos.length || !!tempTodo) && (
          <TodoList tempTodo={tempTodo} />
        )}

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosIds={completedTodosIds}
          />
        )}

      </div>

      <Error />
    </div>
  );
};
