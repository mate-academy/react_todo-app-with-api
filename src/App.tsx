import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  createTodo,
  destroyTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { FilterStatus } from './types/FilterStatus';
import { ErrorBlock } from './components/ErrorBlock/ErrorBlock';

const USER_ID = 10266;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState(FilterStatus.ALL);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisable, setIsInputDisable] = useState(false);
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
      case FilterStatus.ACTIVE:
        return !completed;
      case FilterStatus.COMPLETED:
        return completed;
      default:
        return true;
    }
  }), [todos, filter]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setError('Title can`t be empty');

      return;
    }

    try {
      setError('');
      setIsInputDisable(true);
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
      setIsInputDisable(false);
      setTempTodo(null);
      setIsLoaderVisible(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
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
  };

  const handleDeleteComplitedTodos = async () => {
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
  };

  const handleTodoToggle = async (id: number) => {
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
  };

  const handleTodoToggleAll = async () => {
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
  };

  const handleEditTodo = async (id: number, title: string) => {
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
  };

  const handleCloseError = () => {
    setError('');
  };

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

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosCount={activeTodosCount}
          onInputChange={handleInputChange}
          inputValue={inputValue}
          onSubmit={handleSubmit}
          inputDisabled={isInputDisable}
          onToggleAllTodos={handleTodoToggleAll}
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
              onEditTodo={handleEditTodo}
            />
            <Footer
              hasCompletedTodos={hasCompletedTodos}
              activeTodosCount={activeTodosCount}
              filter={filter}
              onChangeFilter={setFilter}
              onDeleteCompletedTodos={handleDeleteComplitedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorBlock
          onClose={handleCloseError}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
