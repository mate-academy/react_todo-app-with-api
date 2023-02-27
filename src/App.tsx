/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  addTodos, deleteTodos, getTodos, updateTodo,
} from './api/todos';
import { Errors } from './Components/Errors/Errors';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterField } from './types/FilterField';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { prepareTodos } from './utils/prepareTodos';

const USER_ID = 6327;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorType.NONE);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterField>(FilterField.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const count = todos.length;
  const todoCompleted = todos.filter(item => item.completed === true);
  const hasCompletedTodo = !!todoCompleted.length;
  const preparedTodos = prepareTodos(filterBy, todos);
  const checkingTodos = todos.length > 0 || tempTodo !== null;

  const isActive = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const loadTodoFromServer = async () => {
    try {
      const todoFromServer = await getTodos(USER_ID);

      setTodos(todoFromServer);
    } catch {
      setError(ErrorType.UPLOAD_ERROR);
    }
  };

  useEffect(() => {
    loadTodoFromServer();
  }, []);

  const errorClose = () => {
    setIsError(false);
  };

  const setFilterByField = (field: FilterField) => {
    setFilterBy(field);
  };

  const addNewTodo = async (todoTitle: string) => {
    if (!todoTitle.trim()) {
      setIsError(true);
      setError(ErrorType.EMPTY_ERROR);

      return;
    }

    try {
      setIsWaiting(true);

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      await addTodos(USER_ID, newTodo);

      setTempTodo(newTodo);

      await loadTodoFromServer();
    } catch {
      setIsError(true);
      setError(ErrorType.UPLOAD_ERROR);
    } finally {
      setIsWaiting(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setIsWaiting(true);

      await deleteTodos(id);
      await loadTodoFromServer();
    } catch {
      setIsError(true);
      setError(ErrorType.DELETE_ERROR);
    } finally {
      setIsWaiting(false);
    }
  };

  const removeAllCompleted = () => {
    todoCompleted.map(item => removeTodo(item.id));
  };

  const changeTodos = async (todo: Todo, title?: string) => {
    if (todo.title === title) {
      return;
    }

    if (title?.length === 0) {
      removeTodo(todo.id);

      return;
    }

    const updatedTodo = title
      ? ({ ...todo, title })
      : ({ ...todo, completed: !todo.completed });

    try {
      setIsWaiting(true);

      await updateTodo(updatedTodo);
      await loadTodoFromServer();
    } catch {
      setIsError(true);
      setError(ErrorType.UPDATE_ERROR);
    } finally {
      setIsWaiting(false);
    }
  };

  // const changeTodosIdsToUpdate = (value: number) => {
  //   setTodosIdsToUpdate((currentIds) => [...currentIds, value]);
  // };

  // const resetTodosIdsToUpdate = () => {
  //   setTodosIdsToUpdate([]);
  // };

  // const changeCompletedStatus = async (todo: Todo) => {
  // try {
  //     // setIsUpdateWaiting(true);

  //     // const changedData = {
  //     //   completed: status,
  // };

  //     await updateTodo(todo);
  //     await loadTodoFromServer();
  // } catch {
  //     setIsError(true);
  //     setError(ErrorType.UPDATE_ERROR);
  //   }
  // };

  // const toggleTodosStatus = async () => {
  //   todos.map(todo => changeTodosIdsToUpdate(todo.id));

  //   await Promise.all(todos
  //     .map(todo => changeCompletedStatus(todo)));

  //   resetTodosIdsToUpdate();
  // };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          count={count}
          isActiveCount={isActive.length}
          addNewTodo={addNewTodo}
          // toggleTodosStatus={toggleTodosStatus}
        />

        {checkingTodos && (
          <>
            <TodoList
              todos={preparedTodos}
              removeTodo={removeTodo}
              changeTodos={changeTodos}
              isWaiting={isWaiting}
              tempTodo={tempTodo}
            />

            <Footer
              filterBy={filterBy}
              isActiveCount={isActive.length}
              onSetFilterByField={setFilterByField}
              removeAllCompleted={removeAllCompleted}
              hasCompletedTodo={hasCompletedTodo}
            />
          </>
        )}

      </div>

      {isError
      && (
        <Errors
          errorMassage={error}
          onErrorClose={errorClose}
          isError={isError}
        />
      )}
    </div>
  );
};
