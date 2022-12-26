/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from './types/ErrorNotification';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { FilterTodos } from './components/FilterTodos/FilterTodos';
import { Error } from './components/Error/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(ErrorNotification.None);
  const [isAdding, setIsAdding] = useState(false);
  const [loadTodosIds, setLoadTodosIds] = useState<number[]>([]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const todosToToggle = completedTodos.length < todos.length
    ? activeTodos
    : todos;

  const loadingTodos = async () => {
    if (user) {
      setError(ErrorNotification.None);

      try {
        setTodos(await getTodos(user.id));
      } catch {
        setError(ErrorNotification.NoTodos);
      }
    }
  };

  useEffect(() => {
    loadingTodos();
  }, [user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(ErrorNotification.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await loadingTodos();

          setTitle('');
        } catch {
          setError(ErrorNotification.Add);
        } finally {
          setIsAdding(false);
        }
      } else {
        setError(ErrorNotification.Title);
      }
    }, [title, user],
  );

  const handleRemove = useCallback(
    async (todoId: number) => {
      setError(ErrorNotification.None);
      setLoadTodosIds(prevIds => [...prevIds, todoId]);

      try {
        await removeTodo(todoId);

        await loadingTodos();
      } catch {
        setError(ErrorNotification.Remove);
      } finally {
        setLoadTodosIds([]);
      }
    }, [],
  );

  const removeCompletedTodos = useCallback(
    async () => {
      setError(ErrorNotification.None);
      setLoadTodosIds(prevTodoIds => ([
        ...prevTodoIds,
        ...completedTodos.map(todo => todo.id),
      ]));

      try {
        await Promise.all(completedTodos.map(todo => (
          removeTodo(todo.id)
        )));

        await loadingTodos();
      } catch {
        setError(ErrorNotification.Remove);
      } finally {
        setLoadTodosIds([]);
      }
    }, [completedTodos],
  );

  const handleUpdate = useCallback(
    async (todo: Todo) => {
      const { completed, id } = todo;

      setError(ErrorNotification.None);
      setLoadTodosIds(prevIds => [...prevIds, id]);

      try {
        await updateTodo(id, {
          completed: !completed,
        });

        await loadingTodos();
      } catch {
        setError(ErrorNotification.Update);
      } finally {
        setLoadTodosIds([]);
      }
    }, [],
  );

  const handleSetAllCompleted = useCallback(
    async () => {
      await Promise.all(todosToToggle.map(todo => (
        handleUpdate(todo)
      )));
    }, [todosToToggle],
  );

  const handleRename = async (todo: Todo, newTitle: string) => {
    const { title: currentTitle, id } = todo;

    if (!newTitle) {
      handleRemove(id);

      return;
    }

    if (newTitle !== currentTitle) {
      setError(ErrorNotification.None);
      setLoadTodosIds(prevIds => [...prevIds, id]);

      try {
        await updateTodo(id, { title: newTitle });

        await loadingTodos();
      } catch {
        setError(ErrorNotification.Update);
      } finally {
        setLoadTodosIds([]);
      }
    }
  };

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case FilterType.Completed:
          return todo.completed;

        case FilterType.Active:
          return !todo.completed;

        case FilterType.All:
        default:
          return todo;
      }
    })
  ), [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all',
                {
                  active: !activeTodos.length,
                })}
              onClick={handleSetAllCompleted}
            />
          )}

          <NewTodo
            onSubmit={handleSubmit}
            title={title}
            onTitleChange={setTitle}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          isAdding={isAdding}
          onDelete={handleRemove}
          onRename={handleRename}
          onUpdate={handleUpdate}
          loadingTodoIds={loadTodosIds}
          currentTitle={title}
        />

        {(todos.length > 0 || isAdding) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <FilterTodos
              filter={filter}
              onFilterChange={setFilter}
            />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={classNames('todoapp__clear-completed', {
                'todoapp__clear-completed--hidden': !completedTodos.length,
              })}
              onClick={removeCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Error
        error={error}
        onErrorChange={setError}
      />
    </div>
  );
};
