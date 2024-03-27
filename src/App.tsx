/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import {
  USER_ID,
  createTodo,
  deleteTodos,
  getTodos,
  toggleUpdateTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { FilterStatus } from './types/FilterStatus';
import classNames from 'classnames';
import { Errors } from './utils/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isToggleAllLoading, setIsToggleAllLoading] = useState(false);
  const [isClearCompletedLoading, setIsClearCompletedLoading] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.all,
  );

  // const ERROR_ADD_TODO = 'Unable to add a todo';
  // const ERROR_LOAD_TODO = 'Unable to load todos';
  // const ERROR_UPDATE_TODO = 'Unable to update a todo';
  // const ERROR_DELETE_TODO = 'Unable to delete a todo';
  // const ERROR_EMPTY_INPUT = 'Title should not be empty';

  const errorMessageAddTodo = errorMessage === Errors.ERROR_ADD_TODO;

  const allCompleted = todos.every(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const todosLength = todos.length;

  const resetError = () => {
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.ERROR_LOAD_TODO))
      .finally(resetError);
  }, []);

  const todoField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [todosLength, errorMessageAddTodo]);

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const addTodo = async (newTitle: string) => {
    setTempTodo({ id: 0, title: newTitle, completed: false, userId: USER_ID });
    setIsLoading(true);
    setDisabledInput(true);

    return createTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        throw error;
      })
      .finally(() => {
        resetError();
        setIsLoading(false);
        setDisabledInput(false);
      });
  };

  const renameTodo = async (id: number, newTitle: string): Promise<void> => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (currentTodo && currentTodo.title.trim() === newTitle.trim()) {
      return Promise.resolve();
    }

    setIsLoading(true);

    try {
      const updatedTodo = await updateTodo(id, newTitle.trim());

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(Errors.ERROR_UPDATE_TODO);
      throw error;
    } finally {
      resetError();
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    setIsLoading(true);

    try {
      const todo = todos.find(t => t.id === id);
      const updatedTodo = await toggleUpdateTodo(id, !todo?.completed);

      setTodos(prevTodos =>
        prevTodos.map(prevTodo =>
          prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
        ),
      );
    } catch (error) {
      setErrorMessage(Errors.ERROR_UPDATE_TODO);
    } finally {
      resetError();
      setIsLoading(false);
    }
  };

  const removeTodo = async (id: number) => {
    setIsLoading(true);

    return deleteTodos(id)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => {
        setTodos(todos);
        setErrorMessage(Errors.ERROR_DELETE_TODO);
      })
      .finally(() => {
        resetError();
        setIsLoading(false);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setIsClearCompletedLoading(true);

    try {
      await Promise.all(
        completedTodosIds.map(async id => {
          try {
            setIsLoading(true);
            await deleteTodos(id);
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
          } catch (error) {
            setErrorMessage(Errors.ERROR_DELETE_TODO);
          } finally {
            setIsLoading(false);
          }
        }),
      );
    } finally {
      setIsClearCompletedLoading(false);
      resetError();
    }
  };

  const handleToggleAll = async () => {
    setIsToggleAllLoading(true);

    const togglePromises = todos
      .filter(todo => todo.completed !== !allCompleted)
      .map(todo => toggleUpdateTodo(todo.id, !allCompleted));

    try {
      const updatedTodosFromServer = await Promise.all(togglePromises);
      const updatedTodos = todos.map(todo => {
        const updatedTodo = updatedTodosFromServer.find(t => t.id === todo.id);

        return updatedTodo ? { ...todo, ...updatedTodo } : todo;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage(Errors.ERROR_UPDATE_TODO);
    } finally {
      setIsToggleAllLoading(false);
      resetError();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (title.trim()) {
        await addTodo(title).catch(() => {
          throw new Error(Errors.ERROR_ADD_TODO);
        });
        setTitle('');
      } else {
        throw new Error(Errors.ERROR_EMPTY_INPUT);
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      resetError();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todosLength && (
            <button
              type="button"
              className={classNames({
                'todoapp__toggle-all': true,
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={todoField}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={disabledInput}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          renameTodo={renameTodo}
          toggleTodo={toggleTodo}
          isClearCompletedLoading={isClearCompletedLoading}
          isToggleAllLoading={isToggleAllLoading}
        />

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <TodosFilter
              filterStatus={filterStatus}
              onFilterChange={handleFilterChange}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodos.length}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames({
          'notification is-danger is-light has-text-weight-normal': true,
          hidden: !errorMessage.length,
        })}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
