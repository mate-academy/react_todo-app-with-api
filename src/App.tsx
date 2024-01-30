/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, FC } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Errors } from './components/Errors';
import { TodoFilter } from './components/TodoFilter';
import { useTodos } from './context/TodoProvider';
import { TodoForm } from './components/TodoForm';
import { deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    todos, uncompletedCounter, setTodos, setErrorMessage, visibleTodos, USER_ID,
  } = useTodos();
  const someCompleted = visibleTodos.some(todo => todo.completed);
  const someActive = visibleTodos.some(todo => !todo.completed);

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length < 1) {
      return;
    }

    Promise.all(
      completedTodos.map(todo => deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => setErrorMessage('Unable to delete a todo'))),
    ).then(deletedTodosIds => {
      setTodos((prevTodos: Todo[]) => prevTodos
        .filter(todo => !deletedTodosIds.includes(todo.id)));
    })
      .catch(() => setErrorMessage('Unable to delete completed todos'));
  };

  const handleSetAllStatuses = () => {
    let copiedTodos = [...todos];

    if (someActive) {
      copiedTodos = copiedTodos.filter(todo => !todo.completed);
    }

    Promise.all(
      copiedTodos.map(todo => updateTodo(todo.id, { completed: someActive })
        .then(() => todo.id)
        .catch(() => null)),
    ).then(() => {
      setTodos((prevTodos: Todo[]) => prevTodos
        .map(prevTodo => ({ ...prevTodo, completed: someActive })));
    });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0
          && (
            <button
              type="button"
              className={someActive
                ? 'todoapp__toggle-all'
                : 'todoapp__toggle-all active'}
              data-cy="ToggleAllButton"
              onClick={handleSetAllStatuses}
            />
          )}

          <TodoForm />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${uncompletedCounter} items left`}
            </span>

            <TodoFilter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteCompletedTodos}
              disabled={!someCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>

      <Errors />
    </div>
  );
};
