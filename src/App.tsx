/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, patchTodos, postTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Tabs } from './types/Tabs';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [formKey, setFormKey] = useState(0);
  const [selectedTab, setSelectedTab] = useState(Tabs.All);
  const [error, setError] = useState('');
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]); // ids of the changed todos

  const areAllCompleted = todos.every(todo => todo.completed);
  const todoFocus: React.RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    async function getFetchedTodos() {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError('Unable to load todos');
        setIsErrorShown(true);
      }
    }

    getFetchedTodos();
  }, []);

  useEffect(() => setFilteredTodos(todos), [todos]);

  useEffect(() => todoFocus.current?.focus(), [todos, isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (error) {
    setTimeout(() => setIsErrorShown(false), 3000);
  }

  const handleTodoInputFocus = () => todoFocus.current?.focus();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    async function getFetchedTodos() {
      const newTodo = {
        userId: USER_ID,
        title: input,
        completed: false,
      };
      let fetchedTodos;
      const id = new Date().getTime();

      try {
        if (input.trim()) {
          setIsLoading([id]);
          setTodos([
            ...todos,
            {
              id,
              ...newTodo,
            },
          ]);
          fetchedTodos = await postTodos(newTodo);
          setTodos([...todos, fetchedTodos]);
          setInput('');
        } else {
          setError('Title should not be empty');
          setIsErrorShown(true);
        }
      } catch {
        setError('Unable to add a todo');
        setIsErrorShown(true);
        setTodos(todos);
      } finally {
        setIsLoading([]);
      }
    }

    getFetchedTodos();
    setFormKey(n => n + 1);
  };

  const handleCrossThemAll = () => {
    const todosToChange = todos.filter(t => !t.completed);

    async function crossThemAll() {
      if (areAllCompleted) {
        setIsLoading(todos.map(t => t.id));
      } else {
        setIsLoading(todosToChange.map(t => t.id));
      }

      let todosPromise;

      if (areAllCompleted) {
        todosPromise = todos.map(t => {
          return patchTodos(t.id, { ...t, completed: false });
        });
      } else {
        todosPromise = todosToChange.map(t => {
          return patchTodos(t.id, { ...t, completed: true });
        });
      }

      try {
        await Promise.all(todosPromise);
        if (areAllCompleted) {
          setTodos(todos.map(t => ({ ...t, completed: false })));
        } else {
          setTodos(todos.map(t => ({ ...t, completed: true })));
        }
      } catch {
        setError('Unable to update todos');
        setIsErrorShown(true);
        setTodos(todos);
      } finally {
        setIsLoading([]);
      }
    }

    crossThemAll();
  };

  const handleHideError = () => setIsErrorShown(false);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: areAllCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handleCrossThemAll}
          />

          <form onSubmit={handleOnSubmit} key={formKey}>
            <input
              data-cy="NewTodoField"
              value={input}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleInput}
              ref={todoFocus}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          setTodos={setTodos}
          filteredTodos={filteredTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          setIsErrorShown={setIsErrorShown}
          onTodoFocus={handleTodoInputFocus}
        />

        {!!todos?.length && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            selectedTab={selectedTab}
            setFilteredTodos={setFilteredTodos}
            setSelectedTab={setSelectedTab}
            setIsLoading={setIsLoading}
            setError={setError}
            setIsErrorShown={setIsErrorShown}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isErrorShown,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {error}
      </div>
    </div>
  );
};
