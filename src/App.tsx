/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { USER_ID } from './constants';
import * as api from './api/todos';
import { getVisibleTodos } from './services/getVisibleTodos';
import { TodoItem } from './components/TodoItem';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setloadingTodoIds] = useState<number[]>([]);
  const inputElement = useRef<HTMLInputElement>(null);

  function loadTodos() {
    if (inputElement.current) {
      inputElement.current.focus();
    }

    setErrorMessage('');

    api.getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(loadTodos, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!inputText.trim().length) {
      setErrorMessage('Title should not be empty');

      return;
    }

    inputElement.current?.setAttribute('disabled', 'true');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
    });

    setloadingTodoIds(currentIds => [...currentIds, 0]);

    api.createTodo({
      title: inputText.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then((newTodo) => {
        setTodosFromServer((currTodos) => {
          return [...currTodos, newTodo];
        });

        setInputText('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        inputElement.current?.removeAttribute('disabled');
        inputElement.current?.focus();

        setloadingTodoIds((currentIds: number[]) => {
          return currentIds.filter(id => id !== 0);
        });

        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setloadingTodoIds(currentIds => [...currentIds, todoId]);
    api.deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setloadingTodoIds([]);
        inputElement.current?.focus();
      });
  };

  const handleRenameTodo = (todoToChange: Todo, newTitle: string) => {
    setErrorMessage('');
    setloadingTodoIds(currentIds => [...currentIds, todoToChange.id]);

    return api.updateTodo({
      ...todoToChange,
      title: newTitle.trim(),
    })
      .then((updatedTodo) => {
        setTodosFromServer((currentTodos: Todo[]) => {
          return currentTodos.map(currTodo => {
            if (currTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currTodo;
          });
        });

        inputElement.current?.focus();
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setloadingTodoIds((currentIds: number[]) => {
        return currentIds.filter(id => id !== todoToChange.id);
      }));
  };

  const handleChangeTodo = (todoToChange: Todo) => {
    setErrorMessage('');
    setloadingTodoIds(currentIds => [...currentIds, todoToChange.id]);

    api.updateTodo({
      ...todoToChange,
      completed: !todoToChange.completed,
    })
      .then((updatedTodo) => {
        setTodosFromServer((currentTodos: Todo[]) => {
          return currentTodos.map(currTodo => {
            if (currTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currTodo;
          });
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setloadingTodoIds((currentIds: number[]) => {
        return currentIds.filter(id => id !== todoToChange.id);
      }));
  };

  const removeCopletedTodos = (todos: Todo[]) => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const visibleTodos = getVisibleTodos(todosFromServer, filterBy);

  const sumOfActiveTodos = todosFromServer.reduce((sum, todo) => {
    if (!todo.completed) {
      return sum + 1;
    }

    return sum;
  }, 0);

  const isCompletedTodosLeft = sumOfActiveTodos < todosFromServer.length;

  const handleToggleAll = () => {
    if (sumOfActiveTodos) {
      const activeTodos = todosFromServer.filter(todo => !todo.completed);

      activeTodos.forEach(todo => handleChangeTodo(todo));
    } else {
      todosFromServer.forEach(todo => handleChangeTodo(todo));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todosFromServer.length && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: !sumOfActiveTodos },
              )}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={(event) => handleSubmit(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={(event) => setInputText(event.currentTarget.value)}
              ref={inputElement}
            />
          </form>
        </header>

        {!!todosFromServer.length && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                todo={todo}
                key={todo.id}
                onDelete={() => handleDelete(todo.id)}
                loadingTodoIds={loadingTodoIds}
                handleChangeTodo={handleChangeTodo}
                handleRenameTodo={handleRenameTodo}
              />
            ))}
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                loadingTodoIds={loadingTodoIds}
              />
            )}
          </section>
        )}

        {!!todosFromServer.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${sumOfActiveTodos} items left`}
            </span>

            <Filter setQuery={setFilterBy} query={filterBy} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => removeCopletedTodos(todosFromServer)}
              disabled={!isCompletedTodosLeft}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification setErrorMessage={setErrorMessage} errorMessage={errorMessage} />
    </div>
  );
};
