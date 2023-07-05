/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { FilterStatus, Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoLIst';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

const USER_ID = 10888;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodos] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterCondition, setFilterCondition] = useState(FilterStatus.ALL);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [removingTodoId, setRemovingTodoId] = useState(0);

  useEffect(() => {
    const loadTodosByUser = async () => {
      try {
        const uploadedTodos = await getTodos(USER_ID);

        setTodos(uploadedTodos);
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        throw new Error('Unable to add a todo');
      }
    };

    loadTodosByUser();

    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodos({
        id: 0,
        ...newTodo,
      });

      setIsLoading(true);
      const result = await createTodo(newTodo);

      setIsLoading(false);

      setTodos((prev) => [...prev, result]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodos(null);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setRemovingTodoId(todoId);

      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setRemovingTodoId(0);
    }
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => {
      switch (filterCondition) {
        case FilterStatus.ACTIVE:
          return !todo.completed;
        case FilterStatus.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterCondition]);

  const handleFilterChange = (status: FilterStatus) => {
    setFilterCondition(status);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={addTodo}
          query={query}
          onQueryChange={setQuery}
          isLoading={isLoading}
          onErrorMessageChange={setErrorMessage}
          setIsLoading={setIsLoading}
        />
        {/* <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header> */}

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          removingTodoId={removingTodoId}
        />

        {/* Hide the footer if there are no todos */}
        <Footer
          filter={filterCondition}
          handleFilterChange={handleFilterChange}
          initialTodos={todos}
          removeTodo={removeTodo}
        />
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onHandleError={setErrorMessage}
        />
      )}
    </div>
  );
};
