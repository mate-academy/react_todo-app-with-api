/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  addTodo, deleteTodo, getTodos, patchTodo,
} from './api/todos';
import { AuthContext, AuthProvider } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotifications } from './components/ErrorNotifications/ErrorNotifications';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [error, setError] = useState<Error>(Error.None);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    setError(Error.None);

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setError(Error.NoTodos);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  const todosFilter = () => {
    switch (status) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      case Status.All:
      default:
        return todos;
    }
  };

  useEffect(() => {
    todosFilter();
  }, [status]);

  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = todosFilter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(Error.None);

    if (title.trim().length > 0 && user) {
      setIsAdding(true);
      try {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadTodos();

        setTitle('');
      } catch {
        setError(Error.Add);
      } finally {
        setIsAdding(false);
      }
    } else {
      setError(Error.Title);
    }
  };

  const deleteCurrentTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      await loadTodos();
    } catch {
      setError(Error.Delete);
    }
  };

  const deleteComplitedTodos = async () => {
    setLoadingTodoIds(prevIds => [
      ...prevIds,
      ...completedTodos.map(todo => todo.id)]);

    setError(Error.None);

    try {
      await Promise.all(completedTodos.map(todo => (
        deleteTodo(todo.id)
      )));

      await loadTodos();
    } catch {
      setError(Error.Delete);
    }

    setLoadingTodoIds([]);
  };

  const updateTodoStatus = async (updatedTodo: Todo) => {
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);

    await patchTodo(updatedTodo.id, { completed: !updatedTodo.completed });

    await loadTodos();

    setLoadingTodoIds([]);
  };

  const updateTodoTitle = async (updatedTodo: Todo, newTitle: string) => {
    if (newTitle !== updatedTodo.title) {
      await patchTodo(updatedTodo.id, { title: newTitle });
    }

    await loadTodos();
  };

  const completeAllTodos = async () => {
    setLoadingTodoIds(prevIds => [
      ...prevIds,
      ...todos.map(todo => todo.id)]);

    setError(Error.None);

    try {
      if (todos.some(todo => !todo.completed)) {
        await Promise.all(todos.map(
          todo => patchTodo(todo.id, { completed: true }),
        ));
      } else {
        await Promise.all(todos.map(
          todo => patchTodo(todo.id, { completed: false }),
        ));
      }

      await loadTodos();
    } catch {
      setError(Error.Delete);
    }

    setLoadingTodoIds([]);
  };

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0
              && (
                <button
                  data-cy="ToggleAllButton"
                  type="button"
                  className="todoapp__toggle-all active"
                  onClick={completeAllTodos}
                />
              )}

            <TodoForm
              title={title}
              isAdding={isAdding}
              onSubmit={handleSubmit}
              onTitleChange={setTitle}
            />
          </header>
          {todos.length > 0
            && (
              <>
                <TodoList
                  loadingTodoIds={loadingTodoIds}
                  todos={visibleTodos}
                  onTodoDelete={deleteCurrentTodo}
                  onTodoStatusUpdate={updateTodoStatus}
                  onTodoTitleUpdate={updateTodoTitle}
                />

                <footer className="todoapp__footer" data-cy="Footer">
                  <span className="todo-count" data-cy="todosCounter">
                    {`${todos.filter(todo => !todo.completed).length} items left`}
                  </span>

                  <TodoFilter
                    status={status}
                    onStatusChange={setStatus}
                  />
                  <button
                    data-cy="ClearCompletedButton"
                    type="button"
                    className={classNames(
                      'todoapp__clear-completed',
                      {
                        'todoapp__clear-completed--hidden':
                          completedTodos.length === 0,
                      },
                    )}
                    onClick={deleteComplitedTodos}
                  >
                    Clear completed
                  </button>

                </footer>
              </>
            )}
        </div>
        <ErrorNotifications error={error} onErrorMessageChange={setError} />
      </div>
    </AuthProvider>
  );
};
