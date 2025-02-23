/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  creatTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

import { Header } from './conponents/Header/Header';
import { TodoList } from './conponents/TodoList/TodoList';
import { Footer } from './conponents/Footer/Footer';
import { filterTodos } from './utils/filteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Status>(Status.All);
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const titleField = useRef<HTMLInputElement>(null);

  const completedTodos = filterTodos(todos, Status.Completed);

  const activeTodos = filterTodos(todos, Status.Active);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Error.UnableLoad));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    if (titleField.current) {
      titleField.current?.focus();
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddNewTitle = (
    newTitle: string,
    setNewTitle: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const trimmedNewTitle = newTitle.trim();

    if (!trimmedNewTitle) {
      setError(Error.EmptyTitle);

      return;
    }

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedNewTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    creatTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setNewTitle('');
      })
      .catch(() => setError(Error.UnableAdd))
      .finally(() => {
        if (titleField.current) {
          titleField.current.disabled = false;
          titleField.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(id => id !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(Error.UnableDelete))
      .finally(() => {
        setLoadingTodos(current => current.filter(id => id !== todoId));
      });
  };

  const handleDeleteAllCompleted = () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    const request: Promise<unknown>[] = [];

    completedTodosIds.forEach(todoId => request.push(deleteTodo(todoId)));

    setLoadingTodos(current => [...current, ...completedTodosIds]);
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleStatus = (todo: Todo) => {
    setLoadingTodos(current => [...current, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setError(Error.UnableUpdate))
      .finally(() => {
        setLoadingTodos(current => current.filter(id => id !== todo.id));
      });
  };

  const handleRename = (updatedTodo: Todo) => {
    setLoadingTodos(current => [...current, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(() =>
        setTodos(
          todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        ),
      )
      .catch(() => setError(Error.UnableUpdate))
      .finally(() =>
        setLoadingTodos(current => current.filter(id => id !== updatedTodo.id)),
      );
  };

  const handleAllToggleStatus = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(handleToggleStatus);
    } else {
      completedTodos.forEach(handleToggleStatus);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos.length !== 0}
          hasActiveTodos={activeTodos.length > 0}
          handleAddTodo={handleAddNewTitle}
          titleField={titleField}
          onToggleAll={handleAllToggleStatus}
          setTempTodo={setTempTodo}
        />
        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          selectedFilter={filterBy}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
          onToggle={handleToggleStatus}
          handleUpdateTodo={handleRename}
        />

        {!!todos.length && (
          <Footer
            selectedFilter={filterBy}
            setSelectedFilter={setFilterBy}
            deleteAllCompleted={handleDeleteAllCompleted}
            hasActiveTodosCount={activeTodos.length}
            hasCompletedTodos={completedTodos.length !== 0}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
