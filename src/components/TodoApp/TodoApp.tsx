import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { USER_ID } from '../../constants/user';
import { UserWarning } from '../../UserWarning';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Error } from '../Error/Error';
import { Footer } from '../Footer';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  const activeTodosAmount = todos.reduce((acc, cur) => {
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

        {(todos.length > 0 || !!tempTodo) && (
          <TodoList
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
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
