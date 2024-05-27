import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';

// API
import { USER_ID, getTodos, addTodo, modifyTodo } from './api/todos';

import { Todo } from './types/Todo';

import { useCurrentState, useTodosMethods } from './context/Store';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const { todos } = useCurrentState();
  const {
    addTodoLocal,
    setTodosLocal,
    modifyTodoLocal,
    setTimeoutErrorMessage,
  } = useTodosMethods();

  const [input, setInput] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(result => setTodosLocal(result))
      .catch(() => {
        setTimeoutErrorMessage('Unable to load todos');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim()) {
      setTimeoutErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: input.trim(),
      userId: USER_ID,
      completed: false,
    };

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(result => {
        setInput('');
        addTodoLocal(result);
      })
      .catch(() => {
        setTimeoutErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);

        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  };

  const onToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const todoProps = {
      completed: !areAllCompleted,
    };

    for (const todo of todos) {
      if (todo.completed !== todoProps.completed) {
        modifyTodo(todo.id, todoProps)
          .then(() => {
            modifyTodoLocal(todo.id, todoProps);
          })
          .catch(() => {
            setTimeoutErrorMessage('Unable to update a todo');
          });
      }
    }
  };

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
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) && 'active'}`}
              data-cy="ToggleAllButton"
              onClick={onToggleAll}
            />
          )}

          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
            />
          </form>
        </header>

        <TodoList tempTodo={tempTodo} inputRef={inputRef} />

        {!!todos.length && <Footer inputRef={inputRef} />}
      </div>

      <ErrorNotification />
    </div>
  );
};
