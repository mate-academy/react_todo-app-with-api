import React, {
  useEffect, useMemo, useState,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 6713;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NONE);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const activeTodosLength = useMemo(() => todos
    .filter((todo) => !todo.completed).length, [todos]);
  const completedTodosLength = useMemo(() => todos.length - activeTodosLength,
    [todos, activeTodosLength]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterType === FilterType.ALL) {
        return todo;
      }

      return filterType === FilterType.ACTIVE
        ? !todo.completed : todo.completed;
    });
  }, [filterType, todos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(ErrorMessage.LOAD);
      }
    };

    fetchData();
  }, []);

  const handleAddTodo = (title: string) => {
    if (!title.length || title.trim() === '') {
      setErrorMessage(ErrorMessage.EMPTY);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTemporaryTodo(newTodo);
      setErrorMessage(ErrorMessage.NONE);
      setLoadingTodoIds(prev => [...prev, 0]);

      try {
        addTodo(USER_ID, newTodo)
          .then((todo) => {
            setTodos((prevTodos) => {
              setLoadingTodoIds([]);

              return [...prevTodos, todo];
            });
          });
      } catch {
        setErrorMessage(ErrorMessage.ADD);
      } finally {
        setTemporaryTodo(null);
        setLoadingTodoIds([]);
      }
    }
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      deleteTodo(id);
      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== id);
      });
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setTemporaryTodo(null);
      setLoadingTodoIds([]);
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter((todo) => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completed);
    await Promise.all(completed
      .map(completeId => handleDeleteTodo(completeId)));
    setLoadingTodoIds([]);
  };

  const handleToggleTodo = async (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    const updated = todos.filter(todo => todo.id === id)
      .map(todo => ({ ...todo, completed: !todo.completed }))[0];

    try {
      await updateTodo(id, updated);
      setTodos((prev) => prev.map(todo => {
        if (todo.id !== id) {
          return todo;
        }

        return updated;
      }));
    } catch {
      setErrorMessage(ErrorMessage.TOGGLE);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage(ErrorMessage.NONE);
  };

  const handleToggleAll = async (state: boolean) => {
    setLoadingTodoIds(todos.map(todo => todo.id));

    try {
      const updated = todos.map(todo => ({ ...todo, completed: state }));

      await Promise.all(updated.map(todo => updateTodo(todo.id, todo)));

      setTodos(updated);
    } catch {
      setErrorMessage(ErrorMessage.TOGGLEALL);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await updateTodo(id, data);

      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setLoadingTodoIds(state => state.filter(todo => todo !== id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosLength={todos.length}
          onSubmit={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          temporaryTodo={temporaryTodo}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            setFilterType={setFilterType}
            activeTodosLength={activeTodosLength}
            completedTodosLength={completedTodosLength}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Errors
        errorMessage={errorMessage}
        closeError={handleCloseErrorMessage}
      />
    </div>
  );
};
