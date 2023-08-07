/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { ErrorType } from './types/ErrorType';
import { ErrorNorification } from './Components/ErrorNorification';
import { TodosList } from './Components/TodosList';
import { SortBy } from './types/SortBy';
import { TodoFooter } from './Components/TodoFooter';
import { Header } from './Components/Header';

const USER_ID = 10632;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeOfError, setTypeOfError] = useState<ErrorType>(ErrorType.none);
  const [filterBy, setFilterBY] = useState(SortBy.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const countActiveTodos = useMemo(() => {
    const activeTodosCount = todos.reduce((count, current) => {
      if (!current.completed) {
        return count + 1;
      }

      return count;
    }, 0);

    return activeTodosCount;
  }, [todos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
      } catch (error) {
        setTypeOfError(ErrorType.load);
      }
    };

    fetchData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const postNewTodoOnServer = async (newTodo: Todo) => {
    setLoadingIds(prevLoadingIds => [...prevLoadingIds, newTodo.id]);

    try {
      const newTodoFromServer = await postTodo(USER_ID, newTodo);

      setTodos(prevTodos => [
        ...prevTodos.filter(todo => todo.id),
        newTodoFromServer,
      ]);
    } catch (error) {
      setTypeOfError(ErrorType.add);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id));
    } finally {
      setLoadingIds([]);
      setTempTodo(null);
    }
  };

  const handleFilterAllTodos = () => {
    setFilterBY(SortBy.all);
  };

  const handleFilterActiveTodos = () => {
    setFilterBY(SortBy.active);
  };

  const handleFilterCompletedTodos = () => {
    setFilterBY(SortBy.completed);
  };

  const updateTodoStatus = async (currentTodo: Todo) => {
    setLoadingIds(currentIds => [...currentIds, currentTodo.id]);

    let todoToUpdate: Todo;

    const updatedTodos = await Promise.all(
      todos.map(async (todo) => {
        if (todo.id === currentTodo.id) {
          todoToUpdate = {
            ...todo,
            completed: !todo.completed,
          };

          try {
            const updatedTodoFromServer = await updateTodo(
              todoToUpdate.id, todoToUpdate,
            );

            setTodos(prevTodos => [
              ...prevTodos.filter(prevTodo => prevTodo.id !== currentTodo.id),
              updatedTodoFromServer,
            ]);
          } catch {
            setTypeOfError(ErrorType.update);
          } finally {
            setLoadingIds([]);
          }

          return todoToUpdate;
        }

        return todo;
      }),
    );

    setTodos(updatedTodos);
  };

  const handleClearCompletedTodos = async () => {
    const clearedTodos = todos.filter(
      todo => !todo.completed,
    );

    const clearedTodosID: number[] = [];

    try {
      const completedTodo = todos.filter(todo => todo.completed)
        .map(todo => {
          clearedTodosID.push(todo.id);

          return deleteTodo(todo.id);
        });

      setLoadingIds(clearedTodosID);
      await Promise.all(completedTodo);
    } catch {
      setTypeOfError(ErrorType.delete);
    }

    setTodos(clearedTodos);
    setLoadingIds([]);
  };

  const handleDeleteTodo = (deletedTodo: Todo) => {
    setLoadingIds([...loadingIds, deletedTodo.id]);
    deleteTodo(deletedTodo.id)
      .then((data) => {
        if (!data) {
          setTypeOfError(ErrorType.delete);
        }

        setTodos([...todos.filter(todo => todo.id !== deletedTodo.id)]);
        setTempTodo(null);
        setLoadingIds([]);
      });
  };

  const visibleTodosList = [...todos].filter(todo => {
    switch (filterBy) {
      case SortBy.active:
        return !todo.completed;

      case SortBy.completed:
        return todo.completed;

      default:
        break;
    }

    return todo;
  });

  const changeErrorType = (error: ErrorType) => {
    setTypeOfError(error);
  };

  const updateTodosList = (todoList: Todo[]) => {
    setTodos(todoList);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          loadingIds={loadingIds}
          updateTodos={updateTodosList}
          updateError={changeErrorType}
          postNewTodo={postNewTodoOnServer}
          addTempTodo={setTempTodo}
          updateLoadingStatus={setLoadingIds}
        />

        <TodosList
          todos={visibleTodosList}
          updateTodoStatus={updateTodoStatus}
          onDeleteTodo={handleDeleteTodo}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
          updateTodoOnServer={updateTodo}
          updateLoadingStatus={setLoadingIds}
          updateTodosList={updateTodosList}
          updateError={changeErrorType}
        />
        {tempTodo && (
          <TodosList
            todos={[tempTodo]}
            updateTodoStatus={updateTodoStatus}
            onDeleteTodo={handleDeleteTodo}
            loadingIds={loadingIds}
            tempTodo={tempTodo}
            updateTodoOnServer={updateTodo}
            updateLoadingStatus={setLoadingIds}
            updateTodosList={updateTodosList}
            updateError={changeErrorType}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            onFilterAllTodos={handleFilterAllTodos}
            onFilterActiveTodos={handleFilterActiveTodos}
            onFilterCompletedTodos={handleFilterCompletedTodos}
            onClearCompleted={handleClearCompletedTodos}
            selectedFilter={filterBy}
            activeTodos={countActiveTodos}
            todos={todos}
          />
        )}
      </div>

      {typeOfError && (
        <ErrorNorification
          errorType={typeOfError}
          changeErrorType={changeErrorType}
        />
      )}
    </div>
  );
};
