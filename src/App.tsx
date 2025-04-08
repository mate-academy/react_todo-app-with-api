/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodos,
  patchTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { ErrorMessages } from './utils/errorMessageEnum';

import { FilterStatus } from './utils/FilterStatus';
import { Todo } from './types/Todo';
import { Error as ErrorMessage } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.Default,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [todoOnLoading, setTodoOnLoading] = useState<number[] | null>(null);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const loadTodos = () => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(ErrorMessages.Default);

    getTodos()
      .then(result => setTodos(result))
      .catch(() => setErrorMessage(ErrorMessages.LoadTodos))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const removeTodo = async (todoId: number) => {
    setTodoOnLoading([todoId]);
    const result = await deleteTodos(todoId)
      .then(response => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        return !!response;
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteTodo);
      })
      .finally(() => setTodoOnLoading(null));

    return Boolean(result);
  };

  const handleDeleteCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodoOnLoading(completedTodosId);

    Promise.allSettled(completedTodosId.map(id => deleteTodos(id)))
      .then(results => {
        const successfulIds = completedTodosId.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        const hasErrors = results.some(result => result.status === 'rejected');

        if (hasErrors) {
          setErrorMessage(ErrorMessages.DeleteTodo);
        }

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .catch(() => setErrorMessage(ErrorMessages.DeleteTodo))
      .finally(() => setTodoOnLoading(null));
  };

  const handleAddTodos = async (title: string) => {
    let hasError = false;

    if (title.trim().length === 0) {
      setErrorMessage(ErrorMessages.EmptyTitle);

      return null;
    }

    const todo: Omit<Todo, 'id'> = {
      completed: false,
      title: title.trim(),
      userId: USER_ID,
    };

    setTempTodo({ ...todo, id: 0 });
    try {
      const newTodo = await addTodo(todo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error: any) {
      setErrorMessage(ErrorMessages.AddTodo);
      hasError = true;
    } finally {
      setTempTodo(null);
    }

    return hasError;
  };

  const handleEditTodo = async (id: number, title: string) => {
    if (title.trim().length === 0) {
      const isDeleted = await removeTodo(id);

      return isDeleted;
    }

    setTodoOnLoading([id]);

    try {
      const result = await patchTodo(id, { title: title.trim() });

      if (result) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: title.trim() } : todo,
          ),
        );
      }

      return Boolean(result);
    } catch (error: any) {
      setErrorMessage(ErrorMessages.UpdateTodo);
      throw error;
    } finally {
      setTodoOnLoading(null);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.All:
      default:
        return true;
    }
  });

  const handleCompleteAllTodos = async () => {
    try {
      const allCompleted = todos.every(todo => todo.completed);
      const updatedTodos = await Promise.all(
        todos.map(async todo => {
          const newCompletedState = !allCompleted;

          if (todo.completed !== newCompletedState) {
            await patchTodo(todo.id, { completed: newCompletedState });

            return { ...todo, completed: newCompletedState };
          }

          return todo;
        }),
      );

      setTodos(updatedTodos);
    } catch (error: any) {
      setErrorMessage(ErrorMessages.UpdateTodo);
    }
  };

  const onToggle = async (id: number) => {
    setTodoOnLoading([id]);

    try {
      const toggledTodo = todos.find(todo => todo.id === id);

      if (!toggledTodo) {
        return;
      }

      await patchTodo(id, { completed: !toggledTodo.completed });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch (error: any) {
      setErrorMessage(ErrorMessages.UpdateTodo);
    } finally {
      setTodoOnLoading(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && <div>Loading...</div>}

      <div className="todoapp__content">
        <Header
          handleAddTodos={handleAddTodos}
          tempTodo={tempTodo}
          todos={todos}
          handleCompleteAllTodos={handleCompleteAllTodos}
          isLoading={isLoading}
        />

        <TodoList
          filteredTodos={filteredTodos}
          removeTodo={removeTodo}
          todoOnLoading={todoOnLoading}
          handleToggle={onToggle}
          handleEditTodo={handleEditTodo}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            todoOnLoading={[0]}
            handleToggle={onToggle}
            handleEditTodo={handleEditTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
