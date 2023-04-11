/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './components/UserWarning/UserWarning';

import {
  getTodos,
  postTodo,
  deleteTodo,
  patchTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './utils/filterTypes';

import { Loader } from './components/Loader/Loader';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

const USER_ID = 6979;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const clearError = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const loadTodos = async () => {
    setIsLoading(true);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError('Unable to load a todo');

      clearError();

      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    setIsDisabledInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const data = await postTodo(newTodo);

      setTodos(state => [...state, data]);
    } catch {
      setError('Unable to add a todo');
      clearError();
    } finally {
      setIsDisabledInput(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (id: number) => {
    setLoadingIds(state => [...state, id]);

    try {
      await deleteTodo(id);

      setTodos(() => todos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
      clearError();
    } finally {
      setLoadingIds(state => state.filter(el => el !== id));
    }
  };

  const removeCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    completed.forEach(todo => {
      removeTodo(todo.id)
        .then(() => setTodos(todos.filter(item => !item.completed)))
        .catch(() => setError('Unable to delete todos'));
    });
  };

  const handleUpdate = async (id: number, data: Partial<Todo>) => {
    setLoadingIds(state => [...state, id]);

    try {
      await patchTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setError('Unable to update a todo');
      clearError();
    } finally {
      setLoadingIds(state => state.filter(el => el !== id));
    }
  };

  const toggleAll = () => {
    const areAllChecked = todos.every(todo => todo.completed);

    if (areAllChecked) {
      todos.forEach(item => {
        handleUpdate(item.id, { completed: false });
      });
    } else {
      const notChecked = todos.filter(item => !item.completed);

      notChecked.forEach(item => {
        handleUpdate(item.id, { completed: true });
      });
    }
  };

  const filterTodos = (allTodos: Todo[], filterMode: FilterType): Todo[] => {
    switch (filterMode) {
      case FilterType.Active:
        return allTodos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return allTodos.filter(todo => todo.completed);

      default:
        return allTodos;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError("Title can't be empty");
      setIsDisabledInput(true);
      setQuery('');
      setTimeout(() => {
        setError('');
        setIsDisabledInput(false);
      }, 2500);
    }

    addTodo(query);
    setQuery('');
  };

  const visibleTodos = filterTodos(todos, filterType);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {visibleTodos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              aria-label="Toggle all"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleInputChange}
              disabled={isDisabledInput}
            />
          </form>
        </header>

        {isLoading && <Loader />}

        {visibleTodos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={removeTodo}
            onUpdateTodo={handleUpdate}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onRemoveCompleted={removeCompleted}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
      >
        <button type="button" className="delete" />
        {error}
      </div>
    </div>
  );
};
