/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { FilterStatus, Todo, UpdateTodoArgs } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
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
  const [removingTodoId, setRemovingTodoId] = useState(0);
  const [updatedTodoId, setUpdatedTodoId] = useState([0]);

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

      const result = await createTodo(newTodo);

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

  const changeTodoDetails = useCallback(async (todoId: number, data: UpdateTodoArgs) => {
    try {
      setUpdatedTodoId((prev) => [...prev, todoId]);
      const updatedTodo = await updateTodo(todoId, data);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatedTodoId([0]);
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
          onErrorMessageChange={setErrorMessage}
          initialTodos={todos}
          changeTodoDetails={changeTodoDetails}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          removingTodoId={removingTodoId}
          updatedTodoId={updatedTodoId}
          changeTodoDetails={changeTodoDetails}
        />

        {todos.length > 0
          && (
            <Footer
              filter={filterCondition}
              handleFilterChange={handleFilterChange}
              initialTodos={todos}
              removeTodo={removeTodo}
            />
          )}
      </div>

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onHandleError={setErrorMessage}
        />
      )}
    </div>
  );
};
