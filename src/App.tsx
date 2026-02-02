/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos, getActiveTodos } from './utils/todoHelpers';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Empty,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const timerRef = useRef<number>(0);
  const todoInputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    todoInputRef.current?.focus();
  };

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.Empty);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));

    return () => window.clearTimeout(timerRef.current);
  }, []);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Title);

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitle('');
        focusInput();
      })
      .catch(() => showError(ErrorMessage.Add))
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds(current => [...current, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
        focusInput();
      })
      .catch(error => {
        showError(ErrorMessage.Delete);
        throw error;
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setLoadingIds(current => [...current, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(res => {
        setTodos(current =>
          current.map(todo => (todo.id === updatedTodo.id ? res : todo)),
        );
      })
      .catch(error => {
        showError(ErrorMessage.Update);
        throw error;
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== updatedTodo.id));
      });
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    todosToUpdate.forEach(todo =>
      handleUpdateTodo({ ...todo, completed: !allCompleted }),
    );
  };

  const visibleTodos = getVisibleTodos(todos, filter);
  const activeTodosCount = getActiveTodos(todos).length;
  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllCompleted={isAllCompleted}
          title={title}
          setTitle={setTitle}
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
          todoInputRef={todoInputRef}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              isLoading={loadingIds.includes(todo.id)}
            />
          ))}

          {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
        </section>

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessage.Empty)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
