/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getTodos,
  deleteTodo,
  postTodo,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Header } from './components/Header/Header';
import { Loader } from './components/Loader/Loader';
import { TodoList } from './components/TodoList/TodoList';
import { USER_ID } from './types';
import { TodosError } from './types/Errors';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { filterTodos } from './helpers';
import { FilterTodoBy } from './types/FilterTodoBy';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterTodosBy, setFilterTodosBy] = useState(FilterTodoBy.Default);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(TodosError.None);

  const [disableField, setDisableField] = useState(false);

  const visiableTodos = filterTodos(todos, filterTodosBy);
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  const activeTodos = todos.filter(todo => !todo.completed);
  const hasActiveTodos = activeTodos.length !== 0;
  const hasCompletedTodos = completedTodos.length !== 0;

  const handleShowError = (text: TodosError) => {
    setErrorText(text);

    setTimeout(() => {
      setErrorText(TodosError.None);
    }, 3000);
  };

  const handleCloseError = () => {
    setErrorText(TodosError.None);
  };

  const loadTodos = (userId: number) => {
    setIsLoading(true);
    setErrorText(TodosError.None);

    getTodos(userId)
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => {
        handleShowError(TodosError.FailedLoadingGoods);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTodos(USER_ID);
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      handleShowError(TodosError.InvalidTitle);
    } else {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      try {
        setDisableField(true);
        setTempTodo({
          ...newTodo,
          id: 0,
        });

        await postTodo(newTodo)
          .then((response) => setTodos([...todos, response]));
      } catch {
        handleShowError(TodosError.AddTodo);
      } finally {
        setDisableField(false);
        setTempTodo(null);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodosIds(prevTodos => [...prevTodos, todoId]);

      await deleteTodo(todoId);

      setTodos(() => todos.filter(todo => todo.id !== todoId));
    } catch {
      handleShowError(TodosError.DeleteTodo);
    } finally {
      setLoadingTodosIds([]);
    }
  };

  const handleRemoveCompletedTodo = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
    setTodos(todos.filter((todo) => !todo.completed));
  }, [todos]);

  const handleUpdateTodo = async (
    todoId: number,
    updatedTodo: Partial<Todo>,
  ) => {
    setLoadingTodosIds((prevTodos) => [...prevTodos, todoId]);

    try {
      await updateTodo(todoId, updatedTodo);

      setTodos((prevTodos) => prevTodos
        .map((todo) => {
          return todo.id === todoId
            ? {
              ...todo,
              ...updatedTodo,
            }
            : todo;
        }));
    } catch {
      handleShowError(TodosError.UpdateTodo);
    } finally {
      setLoadingTodosIds(currIds => currIds.filter(id => id !== todoId));
    }
  };

  const handleUpdateAllTodod = async () => {
    activeTodos.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: true });
    });

    if (!activeTodos.length) {
      completedTodos.forEach(todo => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isError = (errorText !== TodosError.None);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos}
          onAddTodo={handleAddTodo}
          disable={disableField}
          onUpdateAll={handleUpdateAllTodod}
        />

        {isLoading && (
          <Loader />
        )}

        <TodoList
          tempTodo={tempTodo}
          todos={visiableTodos}
          onDeleteTodo={handleDeleteTodo}
          loadingTodosIds={loadingTodosIds}
          onUpdateTodo={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <TodoFilter
            hasCompletedTodos={hasCompletedTodos}
            activeTodosCount={activeTodos.length}
            filterBy={filterTodosBy}
            changeFilterBy={setFilterTodosBy}
            onCompletedDelete={handleRemoveCompletedTodo}
          />
        )}
      </div>

      {isError && (
        <ErrorMessage
          text={errorText}
          onClose={handleCloseError}
          showError={isError}
        />
      )}
    </div>
  );
};
