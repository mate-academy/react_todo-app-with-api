/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { getVisibleTodos } from './utils/getVisibleTodos';
import { Filter } from './types/filter';
import { ErrorNotifications } from './types/ErrorNotifications';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { NewTodo } from './types/newTodo';

const USER_ID = 6390;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorNotifications>(ErrorNotifications.NONE);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatedTodoId, setUpdatedTodoId] = useState<boolean | number>(0);
  const setErrorType = (error: ErrorNotifications) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    const getTodosById = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setError(true);
        setErrorType(ErrorNotifications.URL);
      }
    };

    getTodosById();
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, filter)
  ), [todos, filter]);

  const isThereCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const filterTodosBy = useCallback(
    (condition: Filter) => {
      setFilter(condition);
    }, [Filter],
  );

  const handleSetQuery = useCallback(
    (value: string) => {
      setQuery(value);
    }, [query],
  );

  const handleSubmit = useCallback(
    async () => {
      if (!query.trim()) {
        setError(true);
        setErrorType(ErrorNotifications.TITLE);
      } else {
        const addedTodo: NewTodo = {
          userId: USER_ID,
          title: query,
          completed: false,
        };

        setTempTodo({
          ...addedTodo,
          id: 0,
        });
        const justCreatedTodo = await addTodo(addedTodo);

        try {
          handleSetQuery('');
          setTodos((prevTodos) => [...prevTodos, justCreatedTodo]);
        } catch (error) {
          setError(true);
          setErrorType(ErrorNotifications.ADD);
        } finally {
          setTempTodo(null);
        }
      }
    }, [query],
  );

  const handleDelete = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError(true);
      setErrorType(ErrorNotifications.DELETE);
    }
  };

  const removeCompletedTodos = () => {
    const filteredCompleted = todos.filter(todo => todo.completed);

    filteredCompleted.map(todo => handleDelete(todo.id));
  };

  const handleUpdateCompleted = async (updatedTodo: Todo) => {
    setUpdatedTodoId(updatedTodo.id);
    const newUpdatedTodo = await updateTodoStatus(
      USER_ID,
      updatedTodo.id,
      !updatedTodo.completed,
    );

    try {
      setTodos(prevTodos => {
        return prevTodos.map(todo => (
          todo.id === updatedTodo.id
            ? newUpdatedTodo
            : todo
        ));
      });
    } catch {
      setError(true);
      setErrorType(ErrorNotifications.UPDATE_STATUS);
    } finally {
      setUpdatedTodoId(0);
    }
  };

  const handleUpdateFullCompleted = async () => {
    try {
      if (todos.every(todo => todo.completed)) {
        todos.forEach(todo => (
          todo.completed
            ? handleUpdateCompleted(todo)
            : todo
        ));
      } else {
        todos.forEach(todo => (
          todo.completed
            ? todo
            : handleUpdateCompleted(todo)
        ));
      }
    } catch {
      setError(true);
      setErrorType(ErrorNotifications.UPDATE_STATUS);
    } finally {
      setUpdatedTodoId(false);
    }
  };

  const handleUpdateTitle = async (updatedTodo: Todo, newTitle: string) => {
    setUpdatedTodoId(updatedTodo.id);

    try {
      const newUpdatedTodo = await updateTodoTitle(
        USER_ID,
        updatedTodo.id,
        newTitle,
      );

      setTodos(prevTodos => {
        return prevTodos.map(todo => (
          todo.id === updatedTodo.id
            ? newUpdatedTodo
            : todo
        ));
      });
    } catch {
      setError(true);
      setErrorType(ErrorNotifications.UPDATE);
    } finally {
      setUpdatedTodoId(0);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  // const event = new Date();

  // event.setHours(event.getHours() + 2);

  // console.log(event);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          todos={todos}
          setQuery={handleSetQuery}
          handleSubmit={handleSubmit}
          tempTodo={tempTodo}
          activeTodosAmount={activeTodosAmount}
          handleUpdateFullCompleted={handleUpdateFullCompleted}
          setUpdatedTodoId={setUpdatedTodoId}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDelete={handleDelete}
              handleUpdateTitle={handleUpdateTitle}
              updatedTodoId={updatedTodoId}
              handleUpdateCompleted={handleUpdateCompleted}
            />
            <Footer
              filter={filter}
              filterTodosBy={filterTodosBy}
              activeTodosAmount={activeTodosAmount}
              isThereCompleted={isThereCompleted}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}

      </div>

      {isError && (
        <ErrorMessage
          errorMessage={errorMessage}
          setError={setError}
        />
      )}
    </div>
  );
};
