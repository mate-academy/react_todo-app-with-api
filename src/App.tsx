import React, {
  useState, useCallback, useEffect, useMemo, useRef,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos, postTodo, deleteTodo, patchTodo, USER_ID,
} from './api/todos';
import TodoList from './components/TodoList';
import { FilterType } from './types/FilterType';
import Footer from './components/Footer';
import HeaderForm from './components/HeaderForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [query, setQuery] = useState('');
  const [errorText, setErrorText] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([0]);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const closeError = useCallback(() => {
    clearTimeout(timeoutId.current!);
    timeoutId.current = setTimeout(() => setErrorText(''), 3000);
  }, []);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleCloseButton = () => setErrorText('');
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

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
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setDisabledInput(true);
      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorText('Unable to add todo');
      closeError();
    } finally {
      setTempTodo(null);
      setDisabledInput(false);
      setLoading(false);
    }
  }, [query]);

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

  const updateTodo = useCallback(
    async (id: number, data: string | boolean) => {
      setLoadingTodoId(state => [...state, id]);
      try {
        if (typeof data === 'boolean') {
          await patchTodo(id, { completed: data });
        } else {
          await patchTodo(id, { title: data });
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

      if (activeTodos.length) {
        setLoadingTodoId(activeIds);

        toggleTodos = activeTodos.map(active => (
          patchTodo(active.id, { ...active, completed: true })
        ));

        updatedTodos = todos.map(todo => (
          activeIds.includes(todo.id) ? { ...todo, completed: true } : todo
        ));
      } else {
        setLoadingTodoId(completedIds);

        toggleTodos = completedTodos.map(completedTodo => (
          patchTodo(completedTodo.id, { ...completedTodo, completed: false })
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
    if (query.trim().length) {
      addTodo(query);
    } else {
      setErrorText('Title is empty');
      closeError();
    }

    setQuery('');
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);

      case FilterType.Active:
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
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !!activeTodos.length },
            )}
            onClick={toggleAllCompleted}
          />
          <HeaderForm
            disabledInput={disabledInput}
            handleSubmitForm={handleSubmitForm}
            handleQueryChange={handleQueryChange}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loading={loading}
          removeTodo={removeTodo}
          loadingTodoId={loadingTodoId}
          updateTodo={updateTodo}
          setErrorText={setErrorText}
        />

        {!!todos.length && (
          <Footer
            activeTodosLength={activeTodos.length}
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
