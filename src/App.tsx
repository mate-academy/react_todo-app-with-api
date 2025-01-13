import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as Methods from './api/todos';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

export enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);
  const [newTodo, setNewTodo] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [pendingTodos, setPendingTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef?.current?.focus();
    }
  }, [isInputDisabled]);

  const filteredTodos = todos.filter(todo => {
    switch (statusFilter) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.reduce(
    (count, todo) => (!todo.completed && todo.id > 0 ? count + 1 : count),
    0,
  );

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const trimmedTitle = newTodo.trim();
    const tempId = Math.random();
    const tempTodoToAdd: Todo = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setPendingTodos([...pendingTodos, tempTodoToAdd]);
    setLoadingTodoId(tempId);
    setIsInputDisabled(true);

    try {
      const addedTodo = await Methods.addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      setPendingTodos(currentPendingTodos =>
        currentPendingTodos.filter(todo => todo.id !== tempId),
      );
      setNewTodo('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setPendingTodos(currentPendingTodos =>
        currentPendingTodos.filter(todo => todo.id !== tempId),
      );
    } finally {
      setLoadingTodoId(null);
      setIsInputDisabled(false);
      inputRef?.current?.focus();
    }
  };

  const toggleTodoStatus = async (todoId: number, completed: boolean) => {
    setLoadingTodoId(todoId);

    try {
      await Methods.updateTodo(todoId, { completed });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, completed } : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoId(null);
      inputRef?.current?.focus();
    }
  };

  const toggleAllTodos = async () => {
    if (isLoading) {
      return;
    }

    const areAllCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    setIsLoading(true);

    try {
      await Promise.all(
        todosToUpdate.map(async todo => {
          await Methods.updateTodo(todo.id, { completed: newCompletedStatus });
        }),
      );

      setTodos(currentTodos =>
        currentTodos.map(todo => ({
          ...todo,
          completed: newCompletedStatus,
        })),
      );
    } catch {
      setErrorMessage('Unable to update all todos');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setLoadingTodoId(todoId);

    try {
      await Methods.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
      inputRef?.current?.focus();
    }
  };

  const clearCompletedTodos = async () => {
    if (isLoading) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);
    let errorOccurred = false;

    setIsLoading(true);

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await Methods.deleteTodo(todo.id);

            setTodos(currentTodos =>
              currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
            );
          } catch {
            setErrorMessage('Unable to delete a todo');
            errorOccurred = true;
          }
        }),
      );
    } catch {
      setErrorMessage('Error occurred while clearing completed todos.');
    } finally {
      setIsLoading(false);
      if (!errorOccurred) {
        setErrorMessage(null);
      }

      inputRef?.current?.focus();
    }
  };

  const updateTodo = async (todoId: number, newTitle: string) => {
    setLoadingTodoId(todoId);

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, title: newTitle } : todo,
      ),
    );

    setLoadingTodoId(null);
  };

  const hideError = () => setErrorMessage(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTodo}
          setNewTitle={setNewTodo}
          onSubmit={addTodo}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
          toggleAllTodos={toggleAllTodos}
          areAllCompleted={todos.every(todo => todo.completed)}
          todos={todos}
        />

        <TodoList
          filteredTodos={[...filteredTodos, ...pendingTodos]}
          loadingTodoId={loadingTodoId}
          deleteTodo={deleteTodo}
          toggleTodoStatus={toggleTodoStatus}
          setErrorMessage={setErrorMessage}
          updateTodo={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredTodos={filteredTodos}
            activeCount={activeCount}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
