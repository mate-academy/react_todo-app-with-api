/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { deleteTodos, getTodos, updateTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { Errors } from './components/Errors';

const USER_ID = 11142;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.all);
  const [error, setError] = useState(Error.without);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const numberOfAllTodos = todos.length;
  const numberOfCompletedTodos = todos.filter(todo => todo.completed).length;
  const numberOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const areAllCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.load));
  }, []);

  const toggleTodo = useCallback((todo: Todo) => {
    const changedStatus = { completed: !todo.completed };

    setDeletingIds((ids) => [...ids, todo.id]);

    updateTodos(todo.id, changedStatus)
      .then(() => {
        return getTodos(USER_ID)
          .then(setTodos)
          .catch(() => setError(Error.load));
      })
      .catch(() => setError(Error.update))
      .finally(() => {
        setDeletingIds((ids) => ids.filter(id => id !== todo.id));
      });
  }, [todos]);

  const toggleAll = () => {
    if (areAllCompleted) {
      todos.forEach(todo => {
        toggleTodo(todo);
      });
    }

    todos
      .filter(todo => !todo.completed)
      .forEach(todo => toggleTodo(todo));
  };

  const renameTodo = useCallback((todoId: number, newTitle: string) => {
    if (newTitle.trim().length === 0) {
      setError(Error.update);

      return;
    }

    const newData = { title: newTitle };

    setDeletingIds((ids) => [...ids, todoId]);

    updateTodos(todoId, newData)
      .then(() => {
        return getTodos(USER_ID)
          .then(setTodos)
          .catch(() => setError(Error.load));
      })
      .catch(() => {
        setError(Error.update);
      })
      .finally(() => {
        setDeletingIds((ids) => ids.filter(id => id !== todoId));
      });
  }, [todos]);

  const deleteTodo = useCallback((todoId: number) => {
    setDeletingIds((ids) => [...ids, todoId]);

    deleteTodos(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => setError(Error.delete))
      .finally(() => {
        setDeletingIds((ids) => ids.filter(id => id !== todoId));
      });
  }, [todos]);

  const visibleTodos = useMemo(() => {
    if (todos) {
      return todos
        .filter(todo => {
          switch (status) {
            case Status.completed:
              return todo.completed;

            case Status.active:
              return !todo.completed;

            default:
              return true;
          }
        });
    }

    return [];
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          userId={USER_ID}
          setTempTodo={setTempTodo}
          setError={setError}
          setTodos={setTodos}
          processing={processing}
          setProcessing={setProcessing}
          areAllCompleted={areAllCompleted}
          toggleAll={toggleAll}
        />

        {numberOfAllTodos !== 0 && (
          <TodoList
            todos={visibleTodos}
            toggleTodo={toggleTodo}
            onRenameTodo={renameTodo}
            onDeleteTodo={deleteTodo}
            deletingIds={deletingIds}
          />
        )}

        {tempTodo && (
          <TodoItem
            tempTodo={tempTodo}
            processing={processing}
          />
        )}

        {numberOfAllTodos !== 0 && (
          <TodoFooter
            numberOfActiveTodos={numberOfActiveTodos}
            numberOfCompletedTodos={numberOfCompletedTodos}
            onStatusChange={setStatus}
            status={status}
            onDeleteTodo={deleteTodo}
            todos={todos}
          />
        )}
      </div>

      {error !== Error.without && (
        <Errors error={error} onClearErrors={setError} />
      )}
    </div>
  );
};
