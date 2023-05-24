/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, updateTodo } from './api/todos';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { useTodoContext } from './contexts/TodoContext';
import { AddForm } from './components/addForm';
import { USER_ID } from './USER_ID';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setError,
  } = useTodoContext();

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => setTodos(response))
      .catch(() => setError('Unable to update a todo'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter((todo) => !todo.completed);

  const showAllTodos = () => {
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
            className={cn('todoapp__toggle-all', {
              active: activeTodos.length > 0,
            })}
            onClick={showAllTodos}
          />

          <AddForm />
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
