/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoErrors } from './components/TodoErrors';

const USER_ID = 11240;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.ALL);
  const [error, setError] = useState(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.LOAD));
  }, []);

  const visibleTodos = useMemo(() => {
    switch (status) {
      case Status.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Status.ACTIVE:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async (titleNewTodo: string) => {
    const newTodo: Todo = {
      userId: USER_ID,
      title: titleNewTodo,
      completed: false,
      id: 0,
    };

    setTempTodo(newTodo);

    try {
      const addedTodo = await todoService.addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (catchError) {
      setError(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.EMPTY);
    } else {
      addTodo(title);
      setTitle('');
    }
  };

  const deleteTodo = async (idToDelete: number) => {
    setProcessingIds(previousIds => [...previousIds, idToDelete]);

    try {
      await todoService.deleteTodo(idToDelete);
      setTodos(existingTodos => {
        return existingTodos.filter(todo => todo.id !== idToDelete);
      });
    } catch (catchError) {
      setError(Error.DELETE);
    } finally {
      setProcessingIds(previousIds => {
        return previousIds.filter(id => id !== idToDelete);
      });
    }
  };

  const deleteCompletedTodos = () => {
    completedTodos.forEach(({ id }) => deleteTodo(id));
    setTodos(activeTodos);
  };

  const updateTodo = async (todoId: number, updates: Partial<Todo>) => {
    setError(Error.NONE);
    setProcessingIds(prev => {
      return [...prev, todoId];
    });

    try {
      const updatedTodo = await todoService.updateTodo(todoId, updates);

      setTodos((currentTodos) => currentTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch (catchError) {
      setError(Error.UPDATE);
    } finally {
      setProcessingIds(prev => prev.filter(itemId => itemId !== todoId));
    }
  };

  const toggleAllStatus = (todoStatus: boolean) => todos
    .forEach(({ id, completed }) => {
      if (completed !== todoStatus) {
        updateTodo(id, { completed: todoStatus });
      }
    });

  const allCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              onClick={() => toggleAllStatus(!allCompleted)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <TodoList
            tempTodo={tempTodo}
            todos={visibleTodos}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
            processingIds={processingIds}
          />
        )}

        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter
              status={status}
              onStatusChange={setStatus}
            />

            <button
              type="button"
              className={cn('todoapp__clear-completed', {
                disabled: !completedTodos.length,
              })}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {error && (
        <TodoErrors
          error={error}
          onErrorChange={setError}
        />
      )}
    </div>
  );
};
