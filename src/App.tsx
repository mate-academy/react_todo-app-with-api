/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos, postTodo, deleteTodo, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { Footer } from './components/Footer';

const USER_ID = 6962;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [query, setQuery] = useState('');
  const [errorText, setErrorText] = useState('');
  const [filterType, setFilterType] = useState(FilterTypes.ALL);
  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([0]);

  const closeError = () => setTimeout(() => setErrorText(''), 3000);
  const handleCloseButton = () => setErrorText('');
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const fetchTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorText('Unable to load todos');
      closeError();
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (title: string) => {
    try {
      setLoading(true);

      if (!title.length) {
        setErrorText("Title can't be empty");
        closeError();

        return;
      }

      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setIsInputDisabled(true);
      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorText('Unable to add todo');
      closeError();
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
      setLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      setLoadingTodoId(state => [...state, id]);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorText('Unable to delete a todo');
      closeError();
    } finally {
      setLoadingTodoId([]);
    }
  }, [todos]);

  const patchTodo = useCallback(
    async (id: number, data: string | boolean) => {
      setLoadingTodoId(state => [...state, id]);
      try {
        if (typeof data === 'boolean') {
          await updateTodo(id, { completed: data });
        } else {
          await updateTodo(id, { title: data });
        }

        setTodos(todos.map(todo => {
          if (todo.id === id) {
            if (typeof data === 'boolean') {
              return { ...todo, completed: data };
            }

            return { ...todo, title: data };
          }

          return todo;
        }));
      } catch (error) {
        if (typeof data === 'string' && data.length === 0) {
          setErrorText('');
        } else {
          setErrorText('Unable to update todo');
        }

        closeError();
      } finally {
        setLoadingTodoId([]);
      }
    }, [todos],
  );

  const toggleAllCompleted = async () => {
    try {
      const activeIds = activeTodos.map(activeTodo => activeTodo.id);
      const completedIds = completedTodos.map(
        completedTodo => completedTodo.id,
      );

      let toggleTodos;
      let updatedTodos;

      if (activeTodos.length !== 0) {
        setLoadingTodoId(activeIds);

        toggleTodos = activeTodos.map(active => (
          updateTodo(active.id, { ...active, completed: true })
        ));

        updatedTodos = todos.map(todo => (
          activeIds.includes(todo.id) ? { ...todo, completed: true } : todo
        ));
      } else {
        setLoadingTodoId(completedIds);

        toggleTodos = completedTodos.map(completedTodo => (
          updateTodo(completedTodo.id, { ...completedTodo, completed: false })
        ));

        updatedTodos = todos.map(todo => (
          completedIds.includes(todo.id)
            ? { ...todo, completed: false } : todo
        ));
      }

      await Promise.all(toggleTodos);
      setTodos(updatedTodos);
    } catch {
      setErrorText('Unable to toggle all todos');
    } finally {
      setLoadingTodoId([]);
    }
  };

  const removeCompletedTodos = async () => {
    try {
      const completeIds = completedTodos.map(({ id }) => removeTodo(id));

      await Promise.all(completeIds);
      setTodos(activeTodos);
    } catch {
      setErrorText('Unable to delete completed todos');
      closeError();
    }
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(query);
    setQuery('');
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [todos, filterType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !!activeTodos.length },
            )}
            onClick={toggleAllCompleted}
          />
          <form
            onSubmit={handleSubmitForm}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isInputDisabled}
              onChange={(event) => setQuery(event.target.value)}
              value={query}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loading={loading}
          removeTodo={removeTodo}
          loadingTodoId={loadingTodoId}
          updateTodo={patchTodo}
          setErrorText={setErrorText}
        />
        {!!todos.length && (
          <Footer
            activeTodos={activeTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            completedTodos={completedTodos}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>
      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorText },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleCloseButton}
        />
        <span>{errorText}</span>
      </div>
    </div>
  );
};
