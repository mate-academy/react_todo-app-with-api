/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  addTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { useState } from 'react';
import { TodosList } from './Todos_list';
import { Todo } from './types/Todo';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [allTodosCompleted, setAllTodosCompleted] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [taskCounter, setTaskCounter] = useState(0);
  const tempTodoCounterRef = useRef(0);

  // Function to show error with auto-dismiss after 3 seconds
  const showError = (message: string) => {
    setError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Load todos on component mount
  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  // Function to close error manually
  const handleCloseError = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setError(null);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Focus the new todo input field on component mount
  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, []);

  // Calculate if all todos are completed dynamically
  useEffect(() => {
    const isAllCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);

    setAllTodosCompleted(isAllCompleted);
    setTaskCounter(todos.filter(todo => !todo.completed && todo.id > 0).length);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    // Create a temporary todo with a unique negative ID for optimistic update
    const tempTodoId = -++tempTodoCounterRef.current;
    const tempTodo: Todo = {
      id: tempTodoId,
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    // Add temporary todo immediately
    setTodos(prevTodos => [...prevTodos, tempTodo]);
    setLoadingTodoId(tempTodoId);

    addTodo(inputValue.trim())
      .then(newTodo => {
        // Replace the temporary todo with the actual one from the server
        setTodos(todosarr =>
          todosarr.map(todo => (todo.id === tempTodoId ? newTodo : todo)),
        );
        setInputValue('');
        setIsAdding(false);
        setLoadingTodoId(null);

        // Focus the input field for adding the next todo
        // Use setTimeout to ensure React has finished updating the DOM
        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      })
      .catch(() => {
        showError('Unable to add a todo');
        // Remove the temporary todo if the request fails
        setTodos(todosarr => todosarr.filter(todo => todo.id !== tempTodoId));
        setIsAdding(false);
        setLoadingTodoId(null);

        // Focus the input field for adding the next todo
        // Use setTimeout to ensure React has finished updating the DOM
        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      });
  };

  const handleUpdateTodo = (id: number, updates: Partial<Todo>) => {
    setLoadingTodoId(id);

    return updateTodo(id, updates)
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      })
      .catch(err => {
        showError('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoId(id);

    return deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));

        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      })
      .catch(err => {
        showError('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: newCompletedStatus }),
    );

    Promise.allSettled(updatePromises).then(results => {
      const successfullyUpdatedIds = todosToUpdate
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (successfullyUpdatedIds.includes(todo.id)) {
            return { ...todo, completed: newCompletedStatus };
          }

          return todo;
        }),
      );

      const hasErrors = results.some(res => res.status === 'rejected');

      if (hasErrors) {
        showError('Unable to update a todo');
      }
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    // 1. Використовуємо Promise.allSettled замість Promise.all
    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        // 2. Визначаємо ID тих тудушок, які видалилися УСПІШНО (status === 'fulfilled')
        const successfullyDeletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        // 3. Оновлюємо стейт, прибираючи тільки ті, що успішно видалилися з сервера
        // (Використовуємо функцію prevTodos, щоб уникнути багів зі застарілим стейтом)
        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        // 4. Перевіряємо, чи була хоча б одна помилка (status === 'rejected')
        const hasErrors = results.some(res => res.status === 'rejected');

        if (hasErrors) {
          showError('Unable to delete a todo');
        }

        // 5. Повертаємо фокус на інпут
        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      },
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodosList
          todos={filteredTodos}
          loadingTodoId={loadingTodoId}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {taskCounter} {taskCounter === 1 ? 'item' : 'items'} left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />
        {error}
      </div>
    </div>
  );
};
