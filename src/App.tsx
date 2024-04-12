import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { ErrorMessages, StatusFilterValue } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/Footer/Footer';
import { getPreparedTodos } from './utils/helpers';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { useTodos } from './utils/hooks';
import classNames from 'classnames';

export const App: React.FC = () => {
  const { error, setError, displayError, todos, setTodos, toggleTodo } =
    useTodos();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    StatusFilterValue.All,
  );

  const preparedTodos = getPreparedTodos(todos, statusFilter);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        displayError(ErrorMessages.TodosLoad);
      });
  }, [displayError, setError, setTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const toggleAll = () => {
    if (activeTodos.length) {
      activeTodos.forEach(activeTodo => toggleTodo(activeTodo));
    } else {
      completedTodos.forEach(completedTodo => toggleTodo(completedTodo));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !activeTodos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}
          <NewTodoForm
            onTodoCreated={newTodo => {
              setTodos(currentTodos => [...currentTodos, newTodo]);
            }}
          />
        </header>
        {!!preparedTodos.length && <TodoList todos={preparedTodos} />}
        {!!todos.length && (
          <Footer
            setStatusFilter={setStatusFilter}
            todos={todos}
            statusFilter={statusFilter}
          />
        )}
      </div>
      <ErrorMessage message={error} setError={setError} />
    </div>
  );
};
