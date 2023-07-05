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
import { getFilteredTodos } from './helpers/helpers';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

const USER_ID = 10929;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.all);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableInput, setDisableInput] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((loadedError: Error) => {
        setErrorMessage(loadedError?.message ?? 'Error');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

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
      setErrorMessage('Unable to add a todo');
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
      const updatingTodoIndex = todos.findIndex(todo => todo.id === id);
      const hasTitle = title
        ? { title }
        : { completed: !todos[updatingTodoIndex].completed };

      const updatedTodo = {
        ...todos[updatingTodoIndex],
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
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodo(currentTodosId => currentTodosId
        .filter(todoId => todoId !== id));
    }
  };

  const updateStatus = async (id: number) => {
    try {
      setLoadingTodo(prevTodosId => [...prevTodosId, id]);
      const updatingTodoIndex = todos.findIndex(todo => todo.id === id);

      await updateTodoStatus(id, !todos[updatingTodoIndex].completed);
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
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodo(currentTodosId => currentTodosId
        .filter(todoId => todoId !== id));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue || inputValue.trim().length === 0) {
      setErrorMessage('Title can not be empty');

      return;
    }

    try {
      setDisableInput(true);
      await addTodo(inputValue);
    } catch {
      setErrorMessage('Unable to add a todo');
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
      setErrorMessage('Unable to delete a todo');
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

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
