import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import './App.scss';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoNotification }
  from './components/TodoNotification/TodoNotification';
import {
  getTodos, removeTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { filterTodos } from './Helpers';
import { ErrorMessages } from './types/ErrorMessages';
import { UpdateTodoArgs } from './types/UpdateTodoArgs';

const USER_ID = 6795;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterOptions.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodosId, setUpdatingTodosId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadError);
      });
  }, []);

  const visibleTodos = useMemo(() => filterTodos(todos, filterOption),
    [filterOption, todos]);

  const activeVisibleTodos = useMemo(
    () => filterTodos(todos, FilterOptions.ACTIVE),
    [todos],
  );
  const completedVisibleTodos = useMemo(
    () => filterTodos(todos, FilterOptions.COMPLETED),
    [todos],
  );
  const isTodosPresent = todos.length > 0;
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = async (todoId: number) => {
    try {
      setUpdatingTodosId((prevState) => [...prevState, todoId]);

      const removeResult = await removeTodo(todoId);

      if (!removeResult) {
        setErrorMessage(ErrorMessages.DeleteError);

        return;
      }

      setTodos((prevState) => (prevState.filter(todo => todo.id !== todoId)));
    } catch (error) {
      setErrorMessage(ErrorMessages.DeleteError);
    } finally {
      setUpdatingTodosId([]);
    }
  };

  const removeCompletedTodos = (todosToDelete: Todo[]) => {
    todosToDelete.forEach(async todoToDelete => {
      await deleteTodo(todoToDelete.id);
    });
  };

  const toggleTodoStatus = async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    try {
      setUpdatingTodosId((prevState) => [...prevState, todoId]);

      await updateTodo(todoId, args);

      setTodos((prevState) => prevState.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateError);
    } finally {
      setUpdatingTodosId([]);
    }
  };

  const toggleAllTodos = () => {
    let actionTodos: Todo[] = [];

    actionTodos = isAllTodosCompleted
      ? completedVisibleTodos
      : activeVisibleTodos;

    actionTodos.forEach(async todoToUpdate => {
      await toggleTodoStatus(todoToUpdate.id,
        { completed: !todoToUpdate.completed });
    });
  };

  const updateTodoTitle = async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    try {
      setUpdatingTodosId((prevState) => [...prevState, todoId]);

      if (!args.title) {
        await deleteTodo(todoId);

        return;
      }

      await updateTodo(todoId, args);

      setTodos((prevState) => prevState.map(todo => {
        if (todo.id === todoId && args.title) {
          return {
            ...todo,
            title: args.title,
          };
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateError);
    } finally {
      setUpdatingTodosId([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodosPresent={isTodosPresent}
          isAllTodosCompleted={isAllTodosCompleted}
          toggleAllTodos={toggleAllTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          USER_ID={USER_ID}
        />

        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          toggleTodoStatus={toggleTodoStatus}
          updatingTodosId={updatingTodosId}
          updateTodoTitle={updateTodoTitle}
        />

        {isTodosPresent && (
          <TodoFooter
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            activeVisibleTodosLength={activeVisibleTodos.length}
            completedVisibleTodos={completedVisibleTodos}
            deleteTodos={removeCompletedTodos}
          />
        )}
      </div>

      <TodoNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

    </div>
  );
};
