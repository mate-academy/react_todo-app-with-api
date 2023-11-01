import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as TodoService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */

const USER_ID = 11706;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [titleTodo, setTitleTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState(false);
  const [update, setUpdate] = useState<number[]>([]);

  const errorTimer = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchTodos = async () => {
      try {
        const todosData = await TodoService.getTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        setErrorMessage(Errors.loading);
        errorTimer();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    let filteredTodos = [...todos];

    filteredTodos = filteredTodos.filter((todo) => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
          return true;

        default:
          return true;
      }
    });

    return filteredTodos;
  }, [todos, filter]);

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const addTodo = async ({ title, userId, completed }: Todo) => {
    try {
      const newTodo = await TodoService.addTodo({ title, userId, completed });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitleTodo('');
    } catch (error) {
      setErrorMessage(Errors.add);
      errorTimer();
    } finally {
      setTempTodo(null);
      setStatus(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setStatus(true);
    setUpdate(current => [...current, todoId]);

    try {
      await TodoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Errors.delete);
    } finally {
      setUpdate(current => current.filter(id => id !== todoId));
      setStatus(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      title: titleTodo.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    if (!titleTodo.trim()) {
      setErrorMessage(Errors.title);
      errorTimer();
    } else {
      addTodo(newTodo);
    }
  };

  const updateTodo = async (newTodo: Todo) => {
    setUpdate(current => [...current, newTodo.id]);
    setStatus(true);

    try {
      await TodoService.updateTodo(newTodo);
      setTodos(current => current.map(curTodo => (
        curTodo.id === newTodo.id ? newTodo : curTodo)));
    } catch (error) {
      setErrorMessage(Errors.update);
      throw error;
    } finally {
      setUpdate(current => current.filter(id => id !== newTodo.id));
      setStatus(false);
    }
  };

  const checkboxTodo = (todo: Todo) => {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo)
      .then(() => { })
      .catch(() => { });
  };

  const toggleAll = () => {
    const completedStatus = activeTodos > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        checkboxTodo(todo);
      }
    });
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(deletePromises);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !activeTodos,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={titleTodo}
              onChange={event => setTitleTodo(event.target.value)}
              ref={input => input && input.focus()}
              disabled={status}
            />
          </form>
        </header>

        {!isLoading && (
          <>
            <TodoList
              todos={visibleTodos}
              checkboxTodo={checkboxTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              update={update}
              mesage={setErrorMessage}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                checkboxTodo={checkboxTodo}
                deleteTodo={deleteTodo}
                update={update}
                updateTodo={updateTodo}
                mesage={setErrorMessage}
              />
            )}

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                onDelete={clearCompletedTodos}
                activeTodos={activeTodos}
              />
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
