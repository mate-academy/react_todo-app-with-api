/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { AddNewTodo } from './components/AddNewTodo/AddNewTodo';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(Status.all);
  const [focusRequested, setFocusRequested] = useState(false);

  // LOAD TODOs from server
  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  // part of 'ADD TODO' logic
  const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const refreshTodo = (newTodo: Todo) => {
    const updatedTodos = todos.map(item => {
      return item.id === newTodo.id ? newTodo : item;
    });

    setTodos(updatedTodos);
  };

  // part of 'DELETE TODO' logic
  const removeDeletedTodo = (id: number) => {
    const todoToDelete = todos.find(item => item.id === id);

    if (todoToDelete) {
      const updatedTodos = todos.filter(todo => todo.id !== id);

      setTodos(updatedTodos);
    } else {
      setErrorMessage('Todo cannot be removed as it is not there already');
    }

    setFocusRequested(true);
  };

  // Logic behind DELETing all completed TODOs
  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => todo)
          .catch(() => {
            setErrorMessage('Unable to delete a todo');

            return null;
          }),
      ),
    ).then(results => {
      const successfulDeletedIds = results
        .filter(
          result => result.status === 'fulfilled' && result.value !== null,
        )
        .map(result => (result as PromiseFulfilledResult<Todo>).value.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulDeletedIds.includes(todo.id)),
      );

      setFocusRequested(true);
    });
  };

  // FILTER TODOs
  const filteredTodos = useMemo(() => {
    switch (statusFilter) {
      case Status.active:
        return todos.filter(todo => !todo.completed);

      case Status.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [statusFilter, todos]);

  // COUNT TODOs
  const activeTodoCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodoCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  // TOGGLE ALL TODOS
  const toggleAllTodos = () => {
    const newStatus = todos.some(todo => !todo.completed);
    const filteredItems = todos.filter(todo => todo.completed !== newStatus);

    Promise.allSettled(
      filteredItems.map(todo =>
        patchTodo({ ...todo, completed: newStatus })
          .then(() => todo)
          .catch(() => {
            setErrorMessage('Unable to update a todo');

            return null;
          }),
      ),
    ).then(results => {
      const successfulUpdatedIds = results
        .filter(
          result => result.status === 'fulfilled' && result.value !== null,
        )
        .map(result => (result as PromiseFulfilledResult<Todo>).value.id);

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          return successfulUpdatedIds.includes(todo.id)
            ? { ...todo, completed: newStatus }
            : todo;
        }),
      );

      setFocusRequested(true);
    });
  };

  // ERROR NOTIFICATION handling
  const errorNoticeRef = useRef<HTMLDivElement>(null);
  const errorNoticeDiv = errorNoticeRef.current as HTMLDivElement;

  const hideErrorNotice = () => {
    errorNoticeDiv.classList.add('hidden');
  };

  // INITIAL CHECK FOR USER ID REGISTRATION
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!loading && todos.length !== 0 && (
            <button
              type="button"
              // ToggleAllButton button has `active` class only if all todos are completed
              className={cn('todoapp__toggle-all', {
                active:
                  completedTodoCount && completedTodoCount === todos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodos}
            />
          )}

          <AddNewTodo
            setErrorMessage={setErrorMessage}
            addTodo={addTodo}
            setTempTodo={setTempTodo}
            focusRequested={focusRequested}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          removeDeletedTodo={removeDeletedTodo}
          refreshTodo={refreshTodo}
        />

        {/* The Footer is shown ONLY when there are any todos to be listed */}
        {todos.length > 0 && (
          <Footer
            activeTodoCount={activeTodoCount}
            completedTodoCount={completedTodoCount}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        hideErrorNotice={hideErrorNotice}
        errorNoticeRef={errorNoticeRef}
      />
    </div>
  );
};
