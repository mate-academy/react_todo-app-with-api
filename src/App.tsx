/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useCallback, useState } from 'react';
import cn from 'classnames';
import { useTodoContext } from './context/TodoContext';
import { getTodos, updateTodo } from './api/todos';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { FooterFilter } from './components/FooterFilter';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 10407;

export const App: React.FC = () => {
  const {
    todos,
    error,
    setTodos,
    setError,
    setTodoIdsInUpdating,
  } = useTodoContext();

  const [toggleStatus, setToggleStatus] = useState<boolean>(false);

  useEffect(() => {
    setToggleStatus(todos.every(todo => todo.completed));
  }, [todos]);

  const loadTodos = async () => {
    try {
      setError(null);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.LOAD);
    }
  };

  const toggleAllComplete = useCallback(async (): Promise<void> => {
    if (todos.every(t => t.completed) || todos.every(t => !t.completed)) {
      setTodoIdsInUpdating(todos.map(todo => todo.id));
    } else {
      setTodoIdsInUpdating(
        todos.filter(todo => !todo.completed).map(todo => todo.id),
      );
    }

    try {
      await Promise.all(todos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !toggleStatus,
        };

        return updateTodo(todo.id, updatedTodo);
      }));

      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        completed: !toggleStatus,
      })));

      setToggleStatus(!toggleStatus);
    } catch {
      setError(Error.UPDATE);
    } finally {
      setTodoIdsInUpdating([]);
    }
  }, [todos, toggleStatus]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every((todo) => todo.completed),
            })}
            onClick={toggleAllComplete}
          />

          <TodoForm />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todos.length} items left`}
              </span>

              <FooterFilter />
            </footer>

          </>
        )}
      </div>

      {error && <ErrorMessage />}
    </div>
  );
};
