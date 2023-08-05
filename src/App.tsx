/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { FILTERS } from './types/FILTERS';
import * as todoService from './api/todos';
import { USER_ID } from './utils/constants';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessed, setIsProcessed] = useState<number[]>([]);

  const allTodoCompleted = useMemo(() => {
    return todos.every(todo => todo.completed) && todos.length !== 0;
  }, [todos]);

  const addTodo = () => {
    setErrorMessage('');

    if (query.trim() === '') {
      setErrorMessage('Title can\'t be empty');
      setQuery('');

      throw new Error();
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    });

    return todoService.createTodo({
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    })
      .then(newTodo => {
        setQuery('');
        setTodos((currentTodos: Todo[]) => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');

        throw error;
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsProcessed(currentId => [...currentId, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(currentTodo => currentTodo.id !== todoId)
        ));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsProcessed([]));
  };

  const deleteCompletedTodos = () => {
    todos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return todo;
    });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessage('');
    setIsProcessed(currentId => [...currentId, updatedTodo.id]);

    return todoService.updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return todoFromServer;
            }

            return currentTodo;
          });
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');

        throw error;
      })
      .finally(() => setIsProcessed([]));
  };

  const toggleAllTodos = () => {
    todos.forEach((todo) => {
      if (todo.completed === allTodoCompleted) {
        updateTodo({ ...todo, completed: !todo.completed });
      }
    });
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FILTERS.ALL:
        return todos;

      case FILTERS.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FILTERS.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to download todos');
      });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (errorMessage !== '') {
      const clearErrorMessage = () => setErrorMessage('');

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(clearErrorMessage, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage]);

  const uncompletedTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: allTodoCompleted },
              )}
              onClick={toggleAllTodos}
            />
          )}

          <NewTodo
            addTodo={addTodo}
            query={query}
            setQuery={setQuery}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isProcessed={isProcessed}
          tempTodo={tempTodo}
        />

        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${uncompletedTodos} items left`}
            </span>

            <Filter
              filter={filter}
              setFilter={setFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={completedTodos === 0}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
