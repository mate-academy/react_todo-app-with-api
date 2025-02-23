import cn from 'classnames';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Statuses } from './types/Statuses';

import { UserWarning } from './components/UserWarning';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';

import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [status, setStatus] = useState<Statuses>(Statuses.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = getFilteredTodos(todos, { status });

  const activeTodos = getFilteredTodos(todos, { status: Statuses.Active });
  const completedTodos = getFilteredTodos(todos, {
    status: Statuses.Completed,
  });

  // Loading Todos
  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadTodo));
  }, []);

  // Handle ErrorMessage
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  // Handle add new todo
  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    // ---validate title
    if (!title) {
      setErrorMessage(Errors.EmptyTodoTitle);

      return;
    }

    // ---disabling input while request
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    // ---post new todo
    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    // ---temporary todo
    setTempTodo({
      id: 0,
      ...newTodo,
    });

    // ---handling loader
    setLoadingTodos(current => [...current, 0]);

    // ---adding todo
    addTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.AddTodo);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  // Handle delete todo
  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage(Errors.DeleteTodo))
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(delTodoId => delTodoId !== todoId),
        );

        inputRef.current?.focus();
      });
  };

  // Handle delete all completed todos
  const handleDeleteAllCompletedTodos = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  // Handle toggle status
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
      .catch(() => setErrorMessage(Errors.UpdateTodo))
      .finally(() => {
        setLoadingTodos(current => current.filter(id => id !== todo.id));
      });
  };

  //Handle toggle all todos status
  const handleToggleStatusAll = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(handleToggleStatus);
    } else {
      completedTodos.forEach(handleToggleStatus);
    }
  };

  // Handle update todo title
  const handleUpdateTodoTitle = (todo: Todo): Promise<string> => {
    setLoadingTodos(current => [...current, todo.id]);

    return updateTodo(todo)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );

        return 'ok';
      })
      .catch(error => {
        setErrorMessage(Errors.UpdateTodo);
        throw error; // Перепередати помилку, щоб зовнішні функції могли її обробити
      })
      .finally(() => {
        setLoadingTodos(current => current.filter(id => id !== todo.id));
      });
  };

  // Handle no authorization or missing USER_ID
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleStatusAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDelete={handleDeleteTodo}
              onToggleStatus={handleToggleStatus}
              onRenameTodo={handleUpdateTodoTitle}
              isLoading={loadingTodos.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem todo={tempTodo} isLoading={loadingTodos.includes(0)} />
          )}
        </section>

        {!!todos.length && (
          <Footer
            status={status}
            setStatus={setStatus}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onDeleteCompleted={handleDeleteAllCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
