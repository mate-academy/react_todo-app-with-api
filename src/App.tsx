/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useContext } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, updateTodo } from './api/todos';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { TodoContext } from './contexts/TodoContext';
import { FormToAddTodo } from './components/FormToAddTodo';
import { USER_ID } from './constants/USER_ID';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setError,
  } = useContext(TodoContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => setTodos(response))
      .catch(() => setError('Unable to fetch todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter((todo) => !todo.completed);

  const handleToggleAll = () => {
    const areAllCompleted = todos.every((todo) => todo.completed);

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);

    updatedTodos.forEach((todo) => {
      updateTodo({
        ...todo,
        completed: !areAllCompleted,
      });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: activeTodos.length > 0,
            })}
            onClick={handleToggleAll}
          />

          <FormToAddTodo />
        </header>

        <TodoList />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <Error />
    </div>
  );
};
