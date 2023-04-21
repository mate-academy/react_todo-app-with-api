import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo, PathchingTodo } from './types/Todo';
import {
  getTodos, postTodo, deleteTodo, patchTodo, USER_ID,
} from './api/todos';
import TodoList from './components/TodoList';
import { FilterType } from './types/FilterType';
import Footer from './components/Footer';
import HeaderForm from './components/HeaderForm';
import ErrorNotifications from './components/ErrorNotifications';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([0]);
  const [errorText, setErrorText]
    = useState<ErrorMessage>(ErrorMessage.NONE);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleCloseErrorMessage = () => {
    setErrorText(ErrorMessage.NONE);
  };

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
      setErrorText(ErrorMessage.LOAD);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (title: string) => {
    try {
      setLoading(true);

      if (!title.length) {
        setErrorText(ErrorMessage.TITLE);

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
      setErrorText(ErrorMessage.ADD);
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
      setErrorText(ErrorMessage.DELETE);
    } finally {
      setLoadingTodoId([]);
    }
  }, [todos]);

  const updateTodo = useCallback(
    async (id: number, data: PathchingTodo) => {
      setLoadingTodoId(state => [...state, id]);
      try {
        await patchTodo(id, data);

        setTodos(todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, ...data };
          }

          return todo;
        }));
      } catch (error) {
        if (data.title.length === 0) {
          setErrorText(ErrorMessage.NONE);
        } else {
          setErrorText(ErrorMessage.UPDATE);
        }
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

      let toggledTodos;
      let updatedTodos;

      if (activeTodos.length) {
        setLoadingTodoId(activeIds);

        toggledTodos = activeTodos.map(active => (
          patchTodo(active.id, { ...active, completed: true })
        ));

        updatedTodos = todos.map(todo => (
          activeIds.includes(todo.id) ? { ...todo, completed: true } : todo
        ));
      } else {
        setLoadingTodoId(completedIds);

        toggledTodos = completedTodos.map(completedTodo => (
          patchTodo(completedTodo.id, { ...completedTodo, completed: false })
        ));

        updatedTodos = todos.map(todo => (
          completedIds.includes(todo.id)
            ? { ...todo, completed: false } : todo
        ));
      }

      await Promise.all(toggledTodos);
      setTodos(updatedTodos);
    } catch {
      setErrorText(ErrorMessage.ALL);
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
      setErrorText(ErrorMessage.DELETE_UPDATED);
    }
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim().length) {
      addTodo(query);
    } else {
      setErrorText(ErrorMessage.TITLE);
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
            query={query}
            setQuery={setQuery}
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
      <ErrorNotifications
        errorMessage={errorText}
        closeError={handleCloseErrorMessage}
      />
    </div>
  );
};
