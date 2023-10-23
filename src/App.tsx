/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import * as todosServices from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 11692;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const inputRef = useRef<HTMLInputElement>(null);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    todosServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    let preparedTodos = [...todos];

    if (filter !== Filter.ALL) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (filter) {
          case Filter.ACTIVE:
            return !todo.completed;

          case Filter.COMPLETED:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    return preparedTodos;
  }, [filter, todos]);

  useEffect(() => {
    setStatusResponse(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [statusResponse, activeTodoId]);

  const todoCount = todos.filter((todo: Todo) => !todo.completed).length;

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatusResponse(true);
    setIsLoading(true);

    const trimmedInputValue = inputValue.trim();

    if (trimmedInputValue === '') {
      setError('Title should not be empty');

      if (inputRef.current) {
        inputRef.current.focus();
      }

      setIsLoading(false);

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedInputValue,
      completed: false,
    };

    const newTempTodo: Todo = {
      id: 0,
      ...data,
    };

    setTempTodo(newTempTodo);

    todosServices.createTodo(data)
      .then(newTodo => {
        setInputValue('');
        setTodos(currentTodos => [
          ...currentTodos,
          newTodo,
        ]);
      })
      .catch(() => {
        setInputValue('');
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    setActiveTodoId(todoId);

    todosServices.deleteTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setActiveTodoId(null);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const toggleTodo = (todo: Todo) => {
    setIsLoading(true);
    setActiveTodoId(todo.id);

    todosServices.updateTodos({
      ...todo,
      completed: !todo.completed,
    })
      .then(() => {
        setTodos(todos.map(post => {
          if (post.id === todo.id) {
            return { ...post, completed: !post.completed };
          }

          return post;
        }));
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setActiveTodoId(null);
      });
  };

  function toggleAll() {
    const allComplated = filteredTodos.every(todo => todo.completed);

    const updatedTodos = filteredTodos.map(todo => ({
      ...todo,
      completed: !allComplated,
    }));

    setTodos(updatedTodos);

    filteredTodos.forEach(todo => {
      todosServices.updateTodos({
        ...todo,
        completed: !allComplated,
      });
    });
  }

  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => Promise.resolve(deleteTodo(todo.id)));

    Promise.allSettled(completedTodos);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: !todoCount },
              )}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={inputRef}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          activeTodoId={activeTodoId}
          isLoading={isLoading}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            activeTodoId={activeTodoId}
            isLoading={isLoading}
          />
        )}

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={todoCount === todos.length}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
