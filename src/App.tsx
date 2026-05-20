/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/errorNotification/ErrorNotification';
import { Footer } from './components/footer/Footer';
import { Header } from './components/header/Header';
import { Main } from './components/main/Main';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadTodos() {
      setIsLoading(true);
      try {
        setTodos(await todoService.getTodos());
      } catch {
        setErrorMessage(ErrorMessage.UnableToLoadTodos);
        setTimeout(() => setErrorMessage(''), 3000);
      } finally {
        setIsLoading(false);
      }
    }

    loadTodos();
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (status === Status.Active) {
      return !todo.completed;
    }

    if (status === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const areAllTodosCompleted = todos.length > 0 && activeTodosCount === 0;

  async function deleteTodo(todoId: number) {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToDeleteTodo);
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
    } finally {
      setDeletingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      const newTodoField = document.querySelector(
        '.todoapp__new-todo',
      ) as HTMLInputElement;

      newTodoField?.focus();
    }
  }

  function deleteAllCompletedTodos() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  }

  async function addTodo(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTodoTitle);
      setTimeout(() => setErrorMessage(''), 3000);

      throw new Error(ErrorMessage.EmptyTodoTitle);
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    });

    try {
      const newTodo = await todoService.addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToAddTodo);
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  }

  async function updateTodo(updatedTodo: Todo) {
    setUpdatingTodoIds(currentIds => [...currentIds, updatedTodo.id]);
    try {
      const post = await todoService.updateTodo(updatedTodo);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === updatedTodo.id ? post : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToUpdateTodo);
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
    } finally {
      setUpdatingTodoIds(currentIds =>
        currentIds.filter(id => id !== updatedTodo.id),
      );
    }
  }

  async function toggleAllTodos() {
    const targetStatus = !areAllTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo({ ...todo, completed: targetStatus }),
    );

    try {
      await Promise.all(updatePromises);
    } catch {}
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="loader" />
        </div>
      )}

      {!isLoading && (
        <div className="todoapp__content">
          <Header
            addTodo={addTodo}
            isSubmitting={isSubmitting}
            areAllTodosCompleted={areAllTodosCompleted}
            toggleAllTodos={toggleAllTodos}
            todosCount={todos.length}
          />

          <Main
            filteredTodos={filteredTodos}
            deleteTodo={deleteTodo}
            deletingTodoIds={deletingTodoIds}
            tempTodo={tempTodo}
            updateTodo={updateTodo}
            updatingTodoIds={updatingTodoIds}
          />

          {/* Hide the footer if there are no todos */}
          {todos.length > 0 && (
            <Footer
              status={status}
              setStatus={setStatus}
              completedTodosCount={completedTodosCount}
              activeTodosCount={activeTodosCount}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
            />
          )}
        </div>
      )}

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
