/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addTodo,
  editTodo,
  getTodos,
  removeTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTodos } from './components/FilterTodos';
import { NewTodoField } from './components/NewTodoField';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [error, setError] = useState(ErrorMessage.None);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const todosShouldToggle = completedTodos.length < todos.length
    ? activeTodos
    : todos;

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
      setError(ErrorMessage.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await loadUserTodos();
          setTitle('');
        } catch {
          setError(ErrorMessage.Add);
        } finally {
          setIsAdding(false);
        }
      } else {
        setError(ErrorMessage.Title);
      }
    }, [title, user],
  );

  const handleDelete = useCallback(
    async (todoId: number) => {
      setError(ErrorMessage.None);
      setLoadingTodosIds(prevIds => [...prevIds, todoId]);

      try {
        await removeTodo(todoId);

        await loadUserTodos();
      } catch {
        setError(ErrorMessage.Delete);
      } finally {
        setLoadingTodosIds([]);
      }
    }, [],
  );

  const handleRemoveCompleted = useCallback(
    async () => {
      await Promise.all(completedTodos.map(todo => (
        handleDelete(todo.id)
      )));
    }, [completedTodos],
  );

  const handleChangeStatus = useCallback(
    async (todo: Todo) => {
      const { completed, id } = todo;

      setError(ErrorMessage.None);
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      try {
        await editTodo(id, {
          completed: !completed,
        });

        await loadUserTodos();
      } catch {
        setError(ErrorMessage.Update);
      } finally {
        setLoadingTodosIds([]);
      }
    }, [],
  );

  const handleToggleAll = useCallback(
    async () => {
      await Promise.all(todosShouldToggle.map(todo => (
        handleChangeStatus(todo)
      )));
    }, [todosShouldToggle],
  );

  const handleRename = async (todo: Todo, newTitle: string) => {
    const { title: curTitle, id } = todo;

    if (!newTitle) {
      handleDelete(id);

      return;
    }

    if (newTitle !== curTitle) {
      setError(ErrorMessage.None);
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      try {
        await editTodo(id, { title: newTitle });

        await loadUserTodos();
      } catch {
        setError(ErrorMessage.Update);
      } finally {
        setLoadingTodosIds([]);
      }
    }
  };

  const showedTodos = useMemo(() => (
    todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
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
              onClick={handleToggleAll}
            />
          )}

          <NewTodoField
            onSubmit={handleSubmit}
            title={title}
            onTitleChange={setTitle}
            isAdding={isAdding}
          />
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={showedTodos}
              curTitle={title}
              isAdding={isAdding}
              onDelete={handleDelete}
              onRename={handleRename}
              onChangeStatus={handleChangeStatus}
              loadingTodosIds={loadingTodosIds}
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
                onClick={handleRemoveCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onErrorChange={setError}
      />
    </div>
  );
};
