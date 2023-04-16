import React, {
  useCallback, useEffect, useState,
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

  const activeTodosLength = todos.filter((todo) => !todo.completed).length;
  const completedTodosLength = todos.length - activeTodosLength;

  const visibleTodos = todos.filter(todo => {
    if (filterType === FilterType.ALL) {
      return todo;
    }

    return filterType === FilterType.ACTIVE ? !todo.completed : todo.completed;
  });

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
    if (!title.length) {
      setErrorMessage(ErrorMessage.EMPTY);
      setTimeout(() => setErrorMessage(ErrorMessage.NONE), 3000);
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

      addTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => {
            setLoadingTodoIds([]);

            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.ADD);
          setTimeout(() => setErrorMessage(ErrorMessage.NONE), 3000);
        })
        .finally(() => {
          setTemporaryTodo(null);
          setLoadingTodoIds([]);
        });
    }
  };

  const handleDeleteTodo = useCallback(
    (id: number) => {
      setLoadingTodoIds(prev => [...prev, id]);

      return deleteTodo(id)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.filter((todo) => todo.id !== id);
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.DELETE);
          setTimeout(() => setErrorMessage(ErrorMessage.NONE), 3000);
        })
        .finally(() => {
          setTemporaryTodo(null);
          setLoadingTodoIds([]);
        });
    },
    [],
  );

  const handleClearCompleted = async () => {
    const completed = todos.filter((todo) => todo.completed).map(t => t.id);

    setLoadingTodoIds(completed);
    await Promise.all(completed
      .map(completeId => handleDeleteTodo(completeId)));
    setLoadingTodoIds([]);
  };

  const handleToggleTodo = async (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    const updated = todos.filter(todo => todo.id === id)
      .map(t => ({ ...t, completed: !t.completed }))[0];

    try {
      await updateTodo(id, updated);
      setTodos((prev) => prev.map(todo => {
        if (todo.id !== id) {
          return todo;
        }

        return updated;
      }));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.NONE);
      }, 3000);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleOnCloseErrorMessage = () => {
    setErrorMessage(ErrorMessage.NONE);
  };

  const handleToggleAll = async (state: boolean) => {
    setLoadingTodoIds(todos.map(todo => todo.id));

    try {
      const updated = todos.map(todo => ({ ...todo, completed: state }));

      await Promise.all(updated.map(todo => updateTodo(todo.id, todo)));

      setTodos(updated);
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.NONE);
      }, 3000);
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
      setErrorMessage(ErrorMessage.ADD);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.NONE);
      }, 3000);
    } finally {
      setLoadingTodoIds(state => state.filter(t => t !== id));
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

      {errorMessage && (
        <Errors
          errorMessage={errorMessage}
          closeError={handleOnCloseErrorMessage}
        />
      )}
    </div>
  );
};
