/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  addTodo, editTodo, getTodos, removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { FilterTodos } from './components/FilterTodos/FilterTodos';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const loadUserTodos = useCallback(async () => {
    if (!user) {
      return;
    }

    setError(ErrorMessage.None);

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorMessage.NoTodos);
    }
  }, [user]);

  useEffect(() => {
    loadUserTodos();
  }, [user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (title.trim() && user) {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadUserTodos();

        setTitle('');
      } else {
        setError(ErrorMessage.Add);
      }
    }, [title, user],
  );

  const deleteCurrentTodo = useCallback(
    async (todoId: number) => {
      setLoadingTodoId(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);
      await loadUserTodos();
      setLoadingTodoId([]);
    }, [],
  );

  const removeComplited = useCallback(
    async () => {
      setError(ErrorMessage.None);

      try {
        await Promise.all(completedTodos.map(todo => (
          removeTodo(todo.id)
        )));

        await loadUserTodos();
      } catch {
        setError(ErrorMessage.Delete);
      }
    }, [completedTodos],
  );

  const handleStatusChange = useCallback(
    async (updatedTodo: Todo) => {
      setError(ErrorMessage.None);
      setLoadingTodoId(prevIds => [...prevIds, updatedTodo.id]);

      await editTodo(updatedTodo.id, {
        completed: !updatedTodo.completed,
      });

      await loadUserTodos();

      setLoadingTodoId([]);
    }, [],
  );

  const handleTitleChange = async (
    updatedTodo: Todo,
    newTitle: string,
  ) => {
    if (!newTitle) {
      deleteCurrentTodo(updatedTodo.id);

      return;
    }

    if (newTitle !== updatedTodo.title) {
      setLoadingTodoId(prevIds => [...prevIds, updatedTodo.id]);
      await editTodo(updatedTodo.id, { title: newTitle });
      await loadUserTodos();
      setLoadingTodoId([]);
    }
  };

  const handleAllStatusChange = async () => {
    setLoadingTodoId(prevIds => [
      ...prevIds,
      ...todos.map(todo => todo.id),
    ]);

    setError(ErrorMessage.None);

    try {
      if (todos.some(todo => !todo.completed)) {
        await Promise.all(todos.map(
          todo => editTodo(todo.id, { completed: true }),
        ));
      } else {
        await Promise.all(todos.map(
          todo => editTodo(todo.id, { completed: false }),
        ));
      }

      await loadUserTodos();
    } catch {
      setError(ErrorMessage.Delete);
    }

    setLoadingTodoId([]);
  };

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (status) {
        case Status.ACTIVE:
          return !todo.completed;

        case Status.COMPLETED:
          return todo.completed;

        case Status.ALL:
        default:
          return true;
      }
    })
  ), [status, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: !activeTodos.length,
                },
              )}
              onClick={handleAllStatusChange}
            />
          )}

          <NewTodoField
            title={title}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onTodoRemove={deleteCurrentTodo}
              loadingTodoId={loadingTodoId}
              onTodoStatusChange={handleStatusChange}
              onTodoTitleChange={handleTitleChange}
            />
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <FilterTodos
                status={status}
                onStatusChange={setStatus}
              />

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className={classNames(
                  'todoapp__clear-completed',
                  {
                    'todoapp__clear-completed--hidden': !completedTodos.length,
                  },
                )}
                onClick={removeComplited}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onErrorMessageChange={setError}
      />
    </div>
  );
};
