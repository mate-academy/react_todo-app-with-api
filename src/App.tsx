/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Section } from './Components/Todolist';
import { TodosFooter } from './Components/TodosFooter';
import { client } from './utils/fetchClient';
import { EnumErrors } from './types/EnumError';

const USER_ID = 'https://mate.academy/students-api/todos?userId=11910';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [typeError, setTypeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await client.getAll<Todo[]>();

        setTodos(response);
      } catch (error) {
        setIsError(true);
        setTypeError(EnumErrors.LOADING);

        setTimeout(() => {
          setIsError(false);
          setTypeError('');
        }, 3000);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const obj = {
      id: Math.floor(Math.random() * 1000),
      title: inputValue,
      completed: false,
      userId: 11910,
    };

    setTempTodo(obj);

    try {
      if (!inputValue.trim()) {
        throw new Error(EnumErrors.EMPTY);
      }

      const response = await client.post<Todo>('/todos?userId=11910', obj);

      setTodos((prevTodos) => [
        ...prevTodos,
        response]);
    } catch (error: any) {
      setIsError(true);

      if (error.message === EnumErrors.EMPTY) {
        setTypeError(EnumErrors.EMPTY);
      } else {
        setTypeError(EnumErrors.ADD);
      }

      setTimeout(() => {
        setIsError(false);
        setTypeError('');
      }, 3000);
    } finally {
      setTimeout(() => {
        setTempTodo(null);
      }, 1000);
    }

    setInputValue('');
  };

  const handleError = (Error: string) => {
    switch (Error) {
      case EnumErrors.LOADING:
        return 'Unable to load todos';
      case EnumErrors.ADD:
        return 'Unable to add a todo';
      case EnumErrors.DELETE:
        return 'Unable to delete a todo';
      case EnumErrors.CHANGE:
        return 'Unable to update a todo';
      case EnumErrors.EMPTY:
        return 'Title should not be empty';
      default:
        return 'null';
    }
  };

  const handleTodosEdit = async (todoEdit: Todo, value: boolean) => {
    await client.patch(`/todos/${todoEdit.id}`, { completed: value });
  };

  const handleInputChange = async () => {
    let updatedTodos: Todo[];

    const localTodosCompleted = todos.filter(todo => todo.completed).length
      !== todos.length;

    if (localTodosCompleted) {
      updatedTodos = todos.map((todo) => ({ ...todo, completed: true }));
    } else {
      updatedTodos = todos.map((todo) => ({ ...todo, completed: false }));
    }

    setTodos(updatedTodos);

    try {
      setIsLoading(true);

      if (localTodosCompleted) {
        todos.map((todo) => ({ ...todo, completed: true }))
          .forEach(todo => {
            handleTodosEdit(todo, true);
          });
      } else {
        todos.map((todo) => ({ ...todo, completed: false }))
          .forEach(todo => {
            handleTodosEdit(todo, false);
          });
      }
    } catch {
      setIsError(true);
      setTypeError(EnumErrors.DELETE);

      setTimeout(() => {
        setIsError(false);
      }, 3000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setTodos(updatedTodos);
      }, 1000);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all',
              { active: todos.find(todo => !todo.completed) })}
            data-cy="ToggleAllButton"
            onClick={() => handleInputChange()}
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        <Section
          filterType={filterType}
          todos={todos}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsError={setIsError}
          tempTodo={tempTodo}
          setTypeError={setTypeError}
        />

        {todos.length !== 0 && (
          <TodosFooter
            todos={todos}
            setTodos={setTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            setIsError={setIsError}
            setTempTodo={setTempTodo}
            setTypeError={setTypeError}
          />
        )}
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className={
            classNames('notification is-danger is-light has-text-weight-normal',
              {
                hidden: !isError,
              })
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          {handleError(typeError)}
        </div>
      )}
    </div>
  );
};
