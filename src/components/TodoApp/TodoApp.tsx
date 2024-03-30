import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { USER_ID } from '../../constants/user';
import { UserWarning } from '../../UserWarning';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Error } from '../Error/Error';
import { Footer } from '../Footer';
import { getActiveTodosAmount } from '../../services/getActiveTodosAmount';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  const activeTodosAmount = getActiveTodosAmount(todos);

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

        {(!!todos.length || !!tempTodo) && <TodoList tempTodo={tempTodo} />}

        {!!todos.length && (
          <Footer
            activeTodosAmount={activeTodosAmount}
            completedTodosIds={completedTodosIds}
          />
        )}
      </div>

      <Error />
    </div>
  );
};
