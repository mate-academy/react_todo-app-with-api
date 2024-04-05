import React from 'react';
import { UserWarning } from '../../UserWarning';
import { TodoHeader } from '../TodoHeader';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { getVisibleTodos } from '../../utils/getVisibleTodos';
import { TodoItem } from '../TodoItem';
import { useTodosContext } from '../../context/TodoContext';
import { USER_ID } from '../../api/todos';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo, status } = useTodosContext();

  const visibleTodos = getVisibleTodos(todos, status);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoHeader />

          <TodoList todos={visibleTodos} />

          {tempTodo && <TodoItem todo={tempTodo} />}

          {todos.length > 0 && <TodoFooter />}
        </div>
        <ErrorNotification />
      </div>
    </section>
  );
};
