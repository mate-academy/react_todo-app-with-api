/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { FilterMethods } from './types/FilterMethods';
import { wait } from './utils/fetchClient';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState(FilterMethods.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const cancelEditing = useCallback(() => {
    setQuery('');
    setLoadingTodosId([]);
    setEditingTodo(null);
  }, [setEditingTodo, setLoadingTodosId]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cancelEditing();
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [cancelEditing]);

  const handleOnClickDelete = async (todoForDelate: Todo) => {
    setLoadingTodosId(prev => [...prev, todoForDelate.id]);
    try {
      await deleteTodo(todoForDelate.id);
      setTodos(prevTodos =>
        prevTodos.filter(todo => todoForDelate.id !== todo.id),
      );
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodosId([]);
    }
  };

  const saveChanges = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery && editingTodo !== null) {
      setLoadingTodosId(prev => [...prev, editingTodo.id]);
      try {
        await deleteTodo(editingTodo.id);
        setTodos(todos.filter(todo => editingTodo.id !== todo.id));
      } catch (error) {
        setErrorMessage('Unable to delete a todo');

        return;
      } finally {
        setLoadingTodosId([]);
      }
    }

    if (trimmedQuery === editingTodo?.title) {
      cancelEditing();

      return;
    }

    if (trimmedQuery && editingTodo) {
      try {
        setLoadingTodosId(prev => [...prev, editingTodo.id]);
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            if (prevTodo.id === editingTodo.id) {
              return {
                ...prevTodo,
                title: trimmedQuery,
              };
            }

            return prevTodo;
          });
        });
        await updateTodoTitle(editingTodo.id, trimmedQuery);

        setEditingTodo(null);
      } catch (error) {
        setErrorMessage('Unable to update a todo');

        return;
      } finally {
        setQuery('');
        setLoadingTodosId([]);
      }
    }
  };

  useEffect(() => {
    if (editingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodo]);

  const handleOnChangeStatus = async (todoForChange: Todo) => {
    try {
      setLoadingTodosId(prev => [...prev, todoForChange.id]);
      await updateTodoStatus(todoForChange.id, !todoForChange.completed);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoForChange.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodosId([]);
    }
  };

  const handleOnDoubleClick = (thisTodo: Todo) => {
    setEditingTodo(thisTodo);
    setQuery(thisTodo.title);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    fetchTodos();
  }, [setErrorMessage, setTodos]);

  useEffect(() => {
    if (errorMessage) {
      wait(3000).then(() => setErrorMessage(''));
    }
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (activeFilter) {
        case FilterMethods.All:
          return todo;
        case FilterMethods.ACTIVE:
          return !todo.completed;
        case FilterMethods.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, activeFilter]);

  const handleOnClickHideError = () => setErrorMessage('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          todos={todos}
          errorMessage={errorMessage}
          setLoadingTodosId={setLoadingTodosId}
          loadingTodosId={loadingTodosId}
          editingTodo={editingTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            handleOnClickDelete={handleOnClickDelete}
            handleOnChangeStatus={handleOnChangeStatus}
            handleOnDoubleClick={handleOnDoubleClick}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            saveChanges={saveChanges}
            query={query}
            filteredTodos={filteredTodos}
            inputRef={inputRef}
            tempTodo={tempTodo}
            loadingTodosId={loadingTodosId}
            editingTodo={editingTodo}
          />
        </section>
        <Footer
          todos={todos}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setLoadingTodosId={setLoadingTodosId}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleOnClickHideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
