/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TodoFooter } from './components/TodoFooter';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoErrors } from './components/TodoErrors';
import { Status } from './types/Status';
import { Error } from './types/Error';

const USER_ID = 11226;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.none);
  const [loading, setLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.load);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (status) {
        case Status.completed:
          return todo.completed;

        case Status.active:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, status]);

  const addTodo = ({ title, completed, userId }: Todo) => {
    return todoService.createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.add);
        throw error;
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage(Error.emptyTitle);

      return;
    }

    const tempTodoData: Todo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setLoading(true);
    setTempTodo(tempTodoData);

    addTodo(tempTodoData)
      .then(() => setTodoTitle(''))
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodoIds(todoIds => [...todoIds, id]);

    return todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch((error) => {
        setErrorMessage(Error.delete);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(todoIds => todoIds.filter(todoId => todoId !== id));
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setLoadingTodoIds(todoIds => [...todoIds, updatedTodo.id]);

    todoService.updateTodo(updatedTodo)
      .then(() => {
        setTodos((currentTodos) => currentTodos.map(
          (todo) => (todo.id === updatedTodo.id ? updatedTodo : todo),
        ));
      })
      .catch((error) => {
        setErrorMessage(Error.update);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(todoIds => todoIds.filter(
          todoId => todoId !== updatedTodo.id,
        ));
      });
  };

  const activeTodos = todos.some(todo => !todo.completed);

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    if (isAllCompleted) {
      todos.forEach(
        todo => updateTodo({ ...todo, completed: !todo.completed }),
      );
    } else {
      const uncompletedTodos = todos.filter(todo => !todo.completed);

      uncompletedTodos.forEach(
        todo => updateTodo({ ...todo, completed: !todo.completed }),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAll}
              className={classNames('todoapp__toggle-all', {
                active: !activeTodos,
              })}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onDelete={(deleteTodo)}
            updateTodo={updateTodo}
            deletingTodoIds={loadingTodoIds}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setTodos={setTodos}
            status={status}
            setStatus={setStatus}
            setError={setErrorMessage}
            setDeletingTodoIds={setLoadingTodoIds}
          />
        )}
      </div>

      {errorMessage && (
        <TodoErrors
          error={errorMessage}
          setError={setErrorMessage}
        />
      )}
    </div>
  );
};
