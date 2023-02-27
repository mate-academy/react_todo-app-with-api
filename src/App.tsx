import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import {
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterOptions } from './types/FilterOptions';
import { getFilteredTodos } from './utils/filterTodos';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6345;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NoError,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  const removeTodo = async (todoId: number) => {
    try {
      setErrorMessage(ErrorMessages.NoError);
      await deleteTodo(todoId);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return prevTodos.filter(item => item.id !== todoId);
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.OnDelete);
    }
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingTodoIds(prevIds => ([...prevIds, todoId]));
    await removeTodo(todoId);
    setLoadingTodoIds(prevIds => prevIds.filter(prevId => prevId !== todoId));
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodosToDelete = getFilteredTodos(
      todos,
      FilterOptions.Completed,
    );

    completedTodosToDelete.forEach(todo => handleDeleteTodo(todo.id));
  }, [todos]);

  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filterType),
    [todos, filterType],
  );

  const isSomeTodosCompleted = todos.some(item => item.completed);

  const isAllTodosCompleted = todos.every(item => item.completed);

  const handleTogglingTodo = useCallback(async (
    todoId: number,
    todoStatus: boolean,
  ) => {
    setLoadingTodoIds(prevIds => ([...prevIds, todoId]));
    try {
      await updateTodoStatus(todoId, todoStatus);
      setErrorMessage(ErrorMessages.NoError);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return prevTodos.map((item: Todo) => {
          if (item.id === todoId) {
            return {
              ...item,
              completed: todoStatus,
            };
          }

          return item;
        });
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.OnUpdate);
    }

    setLoadingTodoIds(prevIds => prevIds.filter(prevId => prevId !== todoId));
  }, []);

  const updateTitle = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    setLoadingTodoIds(prevIds => ([...prevIds, todoId]));
    try {
      await updateTodoTitle(todoId, newTitle);
      setErrorMessage(ErrorMessages.NoError);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return prevTodos.map((item: Todo) => {
          if (item.id === todoId) {
            return {
              ...item,
              title: newTitle,
            };
          }

          return item;
        });
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.OnUpdate);
    }

    setLoadingTodoIds(prevIds => prevIds.filter(prevId => prevId !== todoId));
  }, []);

  const toggleAll = useCallback(() => {
    let newTodoStatus = true;
    let todosToUpdate = todos;

    if (isAllTodosCompleted) {
      newTodoStatus = false;
    } else if (isSomeTodosCompleted) {
      newTodoStatus = true;
      todosToUpdate = getFilteredTodos(todos, FilterOptions.Active);
    }

    todosToUpdate.forEach(todo => handleTogglingTodo(todo.id, newTodoStatus));
  }, [todos]);

  const loadTodos = async () => {
    try {
      setErrorMessage(ErrorMessages.NoError);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorMessages.OnLoad);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const amountOfActive = getFilteredTodos(todos, FilterOptions.Active).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          userId={USER_ID}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          isAllTodosCompleted={isAllTodosCompleted}
          toggleAll={toggleAll}
        />
        {!!todos.length && (
          <TodoList
            todos={visibleTodos}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoIds={loadingTodoIds}
            handleTogglingTodo={handleTogglingTodo}
            updateTitle={updateTitle}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            // handleDeleteTodo={handleDeleteTodo}
            // handleTogglingTodo={handleTogglingTodo}
          />
        )}

        {(!!todos.length || tempTodo) && (
          <Footer
            setFilterType={setFilterType}
            isSomeTodosCompleted={isSomeTodosCompleted}
            deleteCompletedTodos={deleteCompletedTodos}
            amountOfActive={amountOfActive}
          />
        )}

      </div>
      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
