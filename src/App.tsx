/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as f from '../src/api/todos';
import { TodoList } from './components/TodoList';
import { NewTodo, Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './Enum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('All');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorText, setErrorText] = useState('');
  const [addTodoInput, setAddTodoInput] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateTodo = async (
    id: number,
    newTitle: string,
    completed: boolean,
  ) => {
    const updatedData = {
      title: newTitle,
      completed,
    };

    setLoadingTodoId(id);

    await f
      .patchTodo(id, updatedData)
      .then(updatedTodo => {
        setTodos(todos =>
          todos.map(todo =>
            todo.id === id ? { ...todo, ...updatedTodo } : todo,
          ),
        );
        setLoadingTodoId(null);
      })
      .catch(() => {
        setLoadingTodoId(null);
        setErrorText('Unable to update a todo');
        throw new Error("I'm lost");
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    f.getTodos()
      .then(setTodos)
      .catch(error => {
        console.error(error);
        setErrorText('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    switch (filterBy) {
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;

      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;

      default:
        setFilteredTodos(todos);
        break;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [filterBy, todos]);

  useEffect(() => {
    if (errorText) {
      const timer = setTimeout(() => {
        setErrorText('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorText]);

  if (!f.USER_ID) {
    return <UserWarning />;
  }

  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const CompletedTodosCount = todos.filter(todo => todo.completed).length;

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => f.deleteTodo(todo.id));

    Promise.allSettled(deletePromises)
      .then(results => {
        const successfullyDeletedIds = results
          .map((result, index) =>
            result.status === 'fulfilled' ? completedTodos[index].id : null,
          )
          .filter(id => id !== null);

        const failedDeletions = results.filter(
          result => result.status === 'rejected',
        );

        setTodos(todos =>
          todos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        if (failedDeletions.length > 0) {
          setErrorText('Unable to delete a todo');
        }
      })
      .catch(() => {
        setErrorText('Unable to delete a todo');
      });
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = addTodoInput.trim();

    if (!trimmedTitle) {
      setErrorText('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.disabled = true;
    }

    const newTodo: NewTodo = {
      title: trimmedTitle,
      userId: f.USER_ID,
      completed: false,
    };

    const tempId = Date.now();
    const tempTodo = {
      id: tempId,
      completed: true,
      title: trimmedTitle,
      userId: f.USER_ID,
    };

    setLoadingTodoId(tempTodo.id);
    setTodos([...todos, tempTodo]);

    f.postTodo(newTodo)
      .then(createdTodo => {
        setAddTodoInput('');

        // eslint-disable-next-line @typescript-eslint/no-shadow
        setTodos(todos =>
          todos.map(todo => (todo.id === tempId ? createdTodo : todo)),
        );
        setLoadingTodoId(null);
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        setAddTodoInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setTodos(todos => todos.filter(todo => todo.id !== tempId));
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setLoadingTodoId(null);
        if (!addTodoInput.trim()) {
          setErrorText('Title should not be empty');
        } else {
          setErrorText('Unable to add a todo');
        }
      });
    setErrorText('');
  };

  const handleUpdateAllTodo = async () => {
    if (CompletedTodosCount !== todos.length) {
      const promises = todos
        .filter(todo => !todo.completed)
        .map(todo =>
          handleUpdateTodo(todo.id, todo.title, true).catch(error => {
            console.log(`Error updating todo with id ${todo.id}:`, error);
          }),
        );

      const results = await Promise.allSettled(promises);

      results.forEach(result => {
        if (result.status === 'rejected') {
          console.log('Some todos failed to update:', result.reason);
        }
      });
      console.log('All incomplete todos processed');
    } else {
      const promises = todos.map(todo =>
        handleUpdateTodo(todo.id, todo.title, false).catch(error => {
          console.log(`Error updating todo with id ${todo.id}:`, error);
        }),
      );

      const results = await Promise.allSettled(promises);

      results.forEach(result => {
        if (result.status === 'rejected') {
          console.log('Some todos failed to update:', result.reason);
        }
      });
      console.log('All todos processed');
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
              className={classNames(
                'todoapp__toggle-all',
                // eslint-disable-next-line prettier/prettier
                { active: CompletedTodosCount === todos.length }
              )}
              data-cy="ToggleAllButton"
              onClick={handleUpdateAllTodo}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addTodoInput}
              onChange={event => setAddTodoInput(event.target.value)}
              ref={inputRef}
              disabled={!!loadingTodoId}
            />
          </form>
        </header>

        <TodoList
          handleUpdateTodo={handleUpdateTodo}
          todos={filteredTodos}
          setTodos={setTodos}
          loadingTodoId={loadingTodoId}
          setErrorText={setErrorText}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${notCompletedTodosCount} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.values(Filter).map(status => (
                <a
                  key={status}
                  href="#/"
                  data-cy={`FilterLink${status}`}
                  onClick={() => setFilterBy(`${status}`)}
                  className={classNames(
                    'filter__link',
                    // eslint-disable-next-line prettier/prettier
                    { selected: filterBy === status }
                  )}
                >
                  {status}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompletedTodos}
              disabled={CompletedTodosCount === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorText },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorText('')}
        />
        {errorText}
      </div>
    </div>
  );
};
