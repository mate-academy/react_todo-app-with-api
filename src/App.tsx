import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import './App.scss';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoNotification }
  from './components/TodoNotification/TodoNotification';
import {
  createTodo,
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

  const addNewTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorMessages.TitleError);

      return;
    }

    try {
      const newTodoPayload = {
        completed: false,
        title,
        userId: USER_ID,
      };

      setTempTodo({
        id: 0,
        ...newTodoPayload,
      });

      const newTodo = await createTodo(newTodoPayload);

      setTodos((prevState) => [...prevState, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorMessages.AddError);
    } finally {
      setTempTodo(null);
    }
  };

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
      setUpdatingTodosId(
        (prevState) => prevState.filter((id => id !== todoId)),
      );
    }
  };

  const removeCompletedTodos = (todosToDelete: Todo[]) => {
    Promise.all(todosToDelete.map(
      todoToDelete => deleteTodo(todoToDelete.id),
    ));
  };

  const toggleTodoStatus = async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    try {
      setUpdatingTodosId((prevState) => [...prevState, todoId]);

      await updateTodo(todoId, args);

      setTodos((prevState) => prevState.map(todo => {
        return (todo.id === todoId)
          ? {
            ...todo,
            completed: !todo.completed,
          }
          : todo;
      }));
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateError);
    } finally {
      setUpdatingTodosId(
        (prevState) => prevState.filter((id => id !== todoId)),
      );
    }
  };

  const toggleAllTodos = () => {
    let actionTodos: Todo[] = [];

    actionTodos = isAllTodosCompleted
      ? completedVisibleTodos
      : activeVisibleTodos;

    Promise.all(
      actionTodos.map(todoToUpdate => toggleTodoStatus(todoToUpdate.id,
        { completed: !todoToUpdate.completed })),
    );
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
        return (todo.id === todoId && args.title)
          ? {
            ...todo,
            title: args.title,
          }
          : todo;
      }));
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateError);
    } finally {
      setUpdatingTodosId(
        (prevState) => prevState.filter((id => id !== todoId)),
      );
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodosPresent={isTodosPresent}
          isAllTodosCompleted={isAllTodosCompleted}
          toggleAllTodos={toggleAllTodos}
          addNewTodo={addNewTodo}
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
