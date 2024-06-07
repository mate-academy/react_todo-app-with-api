/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorMessage } from './components/EroorMessage/ErrorMessage';
import { TodoInput } from './components/TodoInput/TodoInput';
import { Context } from './components/Context/Context';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const todosToRender = getFilteredTodos();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await client.get<Todo[]>(
          `/todos?userId=${USER_ID}`,
        );

        setTodos(fetchedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <Context.Provider
        value={{
          todos: todos,
          setTodos: setTodos,
          errorMessage: errorMessage,
          setErrorMessage: setErrorMessage,
          filter: filter,
          setFilter: setFilter,
          setTodosToDelete: setTodosToDelete,
          todosToDelete: todosToDelete,
        }}
      >
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoInput setTempTodo={setTempTodo} inputRef={inputRef} />

          {!!todos.length && (
            <>
              <TodoList
                todos={todosToRender}
                tempTodo={tempTodo}
                inputRef={inputRef}
              />

              {/* Hide the footer if there are no todos */}
              <TodoFooter
                todos={todos}
                setFilter={setFilter}
                filter={filter}
                setTodosToDelete={setTodosToDelete}
              />
            </>
          )}
        </div>

        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </Context.Provider>
    </div>
  );
};
