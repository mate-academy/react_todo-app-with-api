import React, {
  useEffect, useState, useMemo, FormEvent, useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoStatus } from './types/Todo';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { filterTodos } from './utils/todoUtil';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 11082;

export const App: React.FC = () => {
  // #region states
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState(TodoStatus.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodosId, setActiveTodosId] = useState<number[]>([]);
  const [temporatyTodo, setTemporatyTodo] = useState<Todo | null>(null);
  // #endregion

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [todos, filterBy]);

  const activeTodos = useMemo(() => {
    return filterTodos(todos, TodoStatus.ACTIVE);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return filterTodos(todos, TodoStatus.COMPLETED);
  }, [todos]);

  // #region handlers
  const handleTodoDelete = useCallback((todoId: number) => {
    setActiveTodosId([todoId]);
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete todo'))
      .finally(() => {
        setActiveTodosId([]);
        setTitle('');
        setIsLoading(false);
      });
  }, []);

  const handleTodoAdd = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTemporatyTodo(todo);
    setIsLoading(true);
    createTodo(todo)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .finally(() => {
        setTemporatyTodo(null);
        setIsLoading(false);
      });
  }, [title]);

  const handleStatusChange = (todoId: number, completed: boolean) => {
    setActiveTodosId([todoId]);
    setIsLoading(true);

    const updatedTodo = {
      completed: !completed,
    };

    updateTodo(todoId, updatedTodo)
      .then(() => setTodos(prev => {
        return prev.map(todo => {
          return todo.id === todoId ? { ...todo, completed: !completed } : todo;
        });
      }))
      .catch(error => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setActiveTodosId([]);
        setIsLoading(false);
      });
  };

  const handleUncompletedStatusChange = async () => {
    setIsLoading(true);

    if (activeTodos.length === 0) {
      try {
        const todoIds = todos.map(todo => todo.id);

        setActiveTodosId(todoIds);

        await Promise.all(todos.map(todo => {
          return updateTodo(todo.id, { completed: false });
        }));

        setTodos(prev => prev.map(todo => {
          return { ...todo, completed: false };
        }));
      } catch (error) {
        setErrorMessage('Some updating API error');
      } finally {
        setActiveTodosId([]);
        setIsLoading(false);
      }
    } else {
      const updatedTodosIds = activeTodos.map(todo => todo.id);

      setActiveTodosId(updatedTodosIds);

      try {
        await Promise.all(updatedTodosIds.map(id => {
          return updateTodo(id, { completed: true });
        }));

        setTodos(prev => prev.map(todo => {
          return updatedTodosIds.some(id => todo.id === id)
            ? { ...todo, completed: true }
            : todo;
        }));
      } catch (error) {
        setErrorMessage('Some updating API error');
      } finally {
        setActiveTodosId([]);
        setIsLoading(false);
      }
    }
  };

  const handleClearCompleted = async () => {
    const deletedTodosIds = completedTodos.map(todo => todo.id);

    setActiveTodosId(deletedTodosIds);
    setIsLoading(true);
    try {
      await Promise.all(deletedTodosIds.map(id => {
        return deleteTodo(id);
      }));

      setTodos(prev => prev.filter(todo => {
        return !deletedTodosIds.some(id => {
          return id === todo.id;
        });
      }));
    } catch (error) {
      setErrorMessage('Some deletion on API error message');
    } finally {
      setActiveTodosId([]);
      setIsLoading(false);
    }
  };
  // #endregion

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          title={title}
          setTitle={setTitle}
          activeTodosQuantity={activeTodos.length}
          onAdd={handleTodoAdd}
          onUncompletedCheckedChange={handleUncompletedStatusChange}
        />

        <TodoList
          todos={visibleTodos}
          activeTodosId={activeTodosId}
          temporaryTodo={temporatyTodo}
          onDelete={handleTodoDelete}
          onStatusChange={handleStatusChange}
        />

        {todos.length > 0 && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosQuantity={activeTodos.length}
            completedTodosQuantity={completedTodos.length}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      {isLoading}
    </div>
  );
};
