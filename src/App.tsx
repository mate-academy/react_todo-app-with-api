/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, patchTodos, postTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filters } from './types/Filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(Filters.All);
  const [error, setError] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]); // ids of the changed todos

  const areAllCompleted = todos.every(todo => todo.completed);
  const todoFocus: React.RefObject<HTMLInputElement> = useRef(null);

  const handleFilters = (filter: Filters) => {
    switch (filter) {
      case Filters.Active:
        setSelectedFilter(Filters.Active);

        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        setSelectedFilter(Filters.Completed);

        return todos.filter(todo => todo.completed);
      default:
        setSelectedFilter(Filters.All);

        return todos;
    }
  };

  const filteredTodos = useMemo(() => {
    return handleFilters(selectedFilter);
  }, [todos, selectedFilter]);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError('Unable to load todos');
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => todoFocus.current?.focus(), [todos, loadingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (error) {
    setTimeout(() => setError(''), 3000);
  }

  const handleTodoInputFocus = () => todoFocus.current?.focus();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      userId: USER_ID,
      title: input,
      completed: false,
    };
    const id = new Date().getTime();

    if (!input.trim()) {
      setError('Title should not be empty');

      return;
    }

    try {
      if (input.trim()) {
        setLoadingTodoIds([id]);
        setTodos([
          ...todos,
          {
            id,
            ...newTodo,
          },
        ]);
        const todo = await postTodos(newTodo);

        setTodos([...todos, todo]);
        setInput('');
      }
    } catch {
      setError('Unable to add a todo');
      setTodos(todos);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleCrossThemAll = async () => {
    let todosToChange;

    if (areAllCompleted) {
      todosToChange = todos.map(t => ({ ...t, completed: false }));
    } else {
      todosToChange = todos
        .filter(t => !t.completed)
        .map(t => ({ ...t, completed: true }));
    }

    setLoadingTodoIds(todosToChange.map(t => t.id));

    const todosPromise = todosToChange.map(t => {
      return patchTodos(t.id, { ...t, completed: false });
    });

    try {
      await Promise.all(todosPromise);
      if (areAllCompleted) {
        setTodos(todosToChange);
      } else {
        setTodos(todos.map(t => ({ ...t, completed: true })));
      }
    } catch {
      setError('Unable to update todos');
      setTodos(todos);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleHideError = () => setError('');

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

          <form onSubmit={handleOnSubmit}>
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
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          setError={setError}
          onTodoFocus={handleTodoInputFocus}
        />

        {!!todos?.length && (
          <Footer
            handleFilters={handleFilters}
            todos={todos}
            setTodos={setTodos}
            selectedFilter={selectedFilter}
            setLoadingTodoIds={setLoadingTodoIds}
            setError={setError}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
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
