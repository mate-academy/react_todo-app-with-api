/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import {
  getTodos,
  createTodo,
  destroyTodo,
  updateTodo,
  USER_ID,
} from './api/todos';

import { Todo, EnumTodoFilter } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState(EnumTodoFilter.ALL);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setisInputDisabled] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isClearCompletedClicked, setIsClearCompletedClicked] = useState(false);
  const [isToggleAllTodosClicked, setIsToggleAllTodosClicked] = useState(false);

  const hasCompletedTodos = useMemo(() => {
    return todos.some((todo) => todo.completed);
  }, [todos]);

  const activeTodosCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const completedTodosId = useMemo(() => {
    return todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);
  }, [todos]);

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (filter) {
      case EnumTodoFilter.ACTIVE:
        return !completed;
      case EnumTodoFilter.COMPLETED:
        return completed;
      default:
        return true;
    }
  }), [todos, filter]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setError('Title can`t be empty');

      return;
    }

    try {
      setError('');
      setisInputDisabled(true);
      setIsLoaderVisible(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: inputValue,
        completed: false,
      });

      const response = await createTodo(USER_ID, {
        userId: USER_ID,
        id: 0,
        title: inputValue.trim(),
        completed: false,
      });

      setTodos((prevTodos) => [...prevTodos, response]);
      setInputValue('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setisInputDisabled(false);
      setTempTodo(null);
      setIsLoaderVisible(false);
    }
  }, [inputValue]);

  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      setError('');
      setSelectedTodoId(id);
      setIsLoaderVisible(true);

      await destroyTodo(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoaderVisible(false);
      setSelectedTodoId(null);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(async () => {
    try {
      setError('');
      setIsClearCompletedClicked(true);
      setIsLoaderVisible(true);

      await Promise.all(
        completedTodosId.map((id: number) => destroyTodo(id)),
      );
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch {
      setError('Unable to delete completed todos');
    } finally {
      setIsLoaderVisible(false);
      setIsClearCompletedClicked(false);
    }
  }, [completedTodosId]);

  const handleTodoToggle = useCallback(async (id: number) => {
    try {
      setError('');
      setIsLoaderVisible(true);

      const toggledTodo = todos.find((todo) => todo.id === id);

      setSelectedTodoId(toggledTodo?.id || null);

      if (toggledTodo) {
        await updateTodo(toggledTodo.id, {
          ...toggledTodo,
          completed: !toggledTodo.completed,
        });

        setTodos((prevTodos) => prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }));
      }
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoaderVisible(false);
      setSelectedTodoId(null);
    }
  }, [todos]);

  const handleToggleAllTodos = useCallback(async () => {
    try {
      setError('');
      setIsToggleAllTodosClicked(true);
      setIsLoaderVisible(true);

      const allCompleted = todos.every((todo) => todo.completed);

      await Promise.all(
        todos.map((todo) => updateTodo(todo.id, {
          ...todo,
          completed: !allCompleted,
        })),
      );

      setTodos((prevTodos) => prevTodos.map((todo) => ({
        ...todo,
        completed: !allCompleted,
      })));
    } catch {
      setError('Unable to update todos');
    } finally {
      setIsLoaderVisible(false);
      setIsToggleAllTodosClicked(false);
    }
  }, [todos]);

  const handleEditTodo = useCallback(async (id: number, title: string) => {
    try {
      setError('');
      setIsLoaderVisible(true);

      const editedTodo = todos.find((todo) => todo.id === id);

      setSelectedTodoId(editedTodo?.id || null);

      if (editedTodo) {
        await updateTodo(editedTodo.id, {
          ...editedTodo,
          title,
        });

        setTodos((prevTodos) => prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
            };
          }

          return todo;
        }));
      }
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoaderVisible(false);
      setSelectedTodoId(null);
    }
  }, [todos]);

  const handleCloseError = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    async function fetchTodos() {
      try {
        setError('');
        const response = await getTodos(USER_ID);

        setTodos(response);
      } catch {
        setError('Unable to load todos');
      }
    }

    fetchTodos();
  }, []);

  return (
    <div className="todoapp">

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosCount={activeTodosCount}
          onInputChange={handleInputChange}
          inputValue={inputValue}
          onSubmit={handleSubmit}
          inputDisabled={isInputDisabled}
          onToggleAllTodos={handleToggleAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isLoading={isLoaderVisible}
              onDeleteTodo={handleDeleteTodo}
              selectedTodoId={selectedTodoId}
              completedTodosId={completedTodosId}
              isClearCompleted={isClearCompletedClicked}
              onToggleTodo={handleTodoToggle}
              isToggleAllTodos={isToggleAllTodosClicked}
              handleEditTodo={handleEditTodo}
            />
            <Footer
              hasCompletedTodos={hasCompletedTodos}
              activeTodosCount={activeTodosCount}
              filter={filter}
              onChangeFilter={setFilter}
              onDeleteCompletedTodos={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorMessage
          onClose={handleCloseError}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
