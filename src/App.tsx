/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  postTodos,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';
import { getFilteredTodos } from './helpers/getFilteredTodos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

const USER_ID = 10775;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [isError, setIsError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableInput, setDisableInput] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((loadedTodos: Todo[]) => {
        setTodos(loadedTodos);
      })
      .catch((loadedError: Error) => {
        setIsError(loadedError?.message ?? 'Error');
      });
  }, []);

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(null);
      }, 3000);
    }
  }, [isError]);

  const addTodo = async (todoTitle: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await postTodos(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const updateTitle = async (
    id: number,
    title: string,
  ) => {
    try {
      setLoadingTodo(prevTodosId => [...prevTodosId, id]);
      const updatingTodo = todos.find(todo => todo.id === id);

      if (!updatingTodo) {
        return;
      }

      const hasTitle = title
        ? { title }
        : { completed: !updatingTodo?.completed };

      const updatedTodo = {
        ...updatingTodo,
        ...hasTitle,
      };

      await updateTodoTitle(id, title);

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id !== id
            ? todo
            : updatedTodo
        ))
      ));
    } catch {
      setIsError('Unable to update a todo');
    } finally {
      setLoadingTodo(currentTodosId => currentTodosId
        .filter(todoId => todoId !== id));
    }
  };

  const updateStatus = async (id: number) => {
    try {
      setLoadingTodo(prevTodosId => [...prevTodosId, id]);
      const updatingTodo = todos.find(todo => todo.id === id);

      if (!updatingTodo) {
        return;
      }

      await updateTodoStatus(id, !updatingTodo.completed);
      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      }));
    } catch {
      setIsError('Unable to update a todo');
    } finally {
      setLoadingTodo(currentTodosId => currentTodosId
        .filter(todoId => todoId !== id));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue || inputValue.trim().length === 0) {
      setIsError('Title can not be empty');

      return;
    }

    try {
      setDisableInput(true);
      await addTodo(inputValue);
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setDisableInput(false);
      setInputValue('');
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setLoadingTodo(prevTodoId => [...prevTodoId, id]);
      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setIsError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(async (todo) => {
      if (todo.completed) {
        await removeTodo(todo.id);
      }
    });
  };

  const handleToggleAll = () => {
    const isSomeTodosCompleted = todos.some(todo => todo.completed);

    const isEveryTodosCompleted = todos.every(todo => todo.completed);

    todos.forEach(async (todo) => {
      if (isSomeTodosCompleted && !todo.completed) {
        await updateStatus(todo.id);
      }

      if (isEveryTodosCompleted || !isSomeTodosCompleted) {
        await updateStatus(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = getFilteredTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleFormSubmit={handleFormSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
          todosLength={todos.length}
          disableInput={disableInput}
          handleToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
            loadingTodo={loadingTodo}
            updateStatus={updateStatus}
            updateTitle={updateTitle}
          />
        )}

        {(todos.length > 0) && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setIsError(null)}
        />
        {isError}
      </div>
    </div>
  );
};
