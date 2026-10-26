/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from './components/ErrorNotification/Index';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.noError,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedIds, setProcessedIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage(ErrorMessage.noError);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.unableToLoad));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo, todos]);

  function getVisibleTodos(): Todo[] {
    switch (status) {
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }

  const visibleTodos = getVisibleTodos();
  const trimmedTitle = title.trim();

  function handleTodoDelete(id: number) {
    setProcessedIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id)),
      )
      .catch(error => {
        setErrorMessage(ErrorMessage.unableToDelete);
        throw error;
      })
      .finally(() =>
        setProcessedIds(prevIds => prevIds.filter(prevId => prevId !== id)),
      );
  }

  function handleDeleteAllCompletedTodos() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(completedTodo => handleTodoDelete(completedTodo.id));
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.titleEmpty);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.unableToAdd))
      .finally(() => {
        setTempTodo(null);
      });
  }

  function handleTodoStatusChange(id: number, completed: boolean) {
    setProcessedIds(prev => [...prev, id]);
    updateTodo({ id, completed })
      .then(updatedTodo =>
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage(ErrorMessage.unableToUpdate))
      .finally(() =>
        setProcessedIds(prevIds => prevIds.filter(prevId => prevId !== id)),
      );
  }

  function handleAllTodosStatusChange() {
    const newStatus = todos.some(todo => !todo.completed);

    const activeTodos = todos.filter(todo => todo.completed !== newStatus);

    activeTodos.forEach(activeTodo =>
      handleTodoStatusChange(activeTodo.id, newStatus),
    );
  }

  function handleEditFormSubmit(id: number, newTitle: string) {
    const trimmedNewTitle = newTitle.trim();
    const currentTodo = todos.find(todo => todo.id === id);

    if (!trimmedNewTitle) {
      return handleTodoDelete(id);
    }

    if (currentTodo && trimmedNewTitle === currentTodo.title) {
      return Promise.resolve();
    }

    setProcessedIds(prev => [...prev, id]);

    return updateTodo({ id, title: trimmedNewTitle })
      .then(newTodo =>
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === newTodo.id ? newTodo : prevTodo,
          ),
        ),
      )
      .catch(error => {
        setErrorMessage(ErrorMessage.unableToUpdate);
        throw error;
      })
      .finally(() => {
        setProcessedIds(prevIds => prevIds.filter(prevId => prevId !== id));
      });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          onTitleChange={setTitle}
          inputFocusRef={inputRef}
          onFormSubmit={handleFormSubmit}
          isTempTodo={tempTodo !== null}
          onAllTodosStatusChange={handleAllTodosStatusChange}
        />
        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              processedIds={processedIds}
              onDelete={handleTodoDelete}
              onStatusChange={handleTodoStatusChange}
              title={title}
              onUpdate={handleEditFormSubmit}
            />
            <Footer
              todos={todos}
              status={status}
              onStatusChange={setStatus}
              onDeleteAllCompletedTodos={handleDeleteAllCompletedTodos}
            />
          </>
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};
