/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  USER_ID as userId,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { Header } from './components/Header';
import { ErrorInfo } from './components/ErrorInfo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<ErrorType>(ErrorType.NoError);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const isAllCompleted = todos.every(todo => todo.completed);
  const isSomeCompleted = todos.some(todo => todo.completed);

  const isTodosNotEmpty = todos.length > 0;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorType.LoadTodos))
      .finally(() => setLoading(false));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  useEffect(() => {
    if (error !== ErrorType.NoError) {
      const timer = setTimeout(() => {
        setError(ErrorType.NoError);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  const counterNotCompleted = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(ErrorType.NoTitle);

      return;
    }

    setLoading(true);
    setLoadingIds(currentIds => [...currentIds, 0]);
    setTodos(currentTodos => [
      ...currentTodos,
      {
        id: 0,
        userId,
        title: title.trim(),
        completed: false,
      },
    ]);
    try {
      const newTodo = await createTodo({
        userId,
        title: title.trim(),
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch (err) {
      setError(ErrorType.AddTodo);
    } finally {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== 0));
      setLoading(false);
      setLoadingIds([]);
    }
  };

  const handleDeleteTodo = async (todoDeleteId: number) => {
    setLoading(true);
    setLoadingIds(currentIds => [...currentIds, todoDeleteId]);
    try {
      await deleteTodo(todoDeleteId);
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== todoDeleteId),
      );

      return true;
    } catch (err) {
      setError(ErrorType.DeleteTodo);

      return false;
    } finally {
      setLoading(false);
      setLoadingIds(currentIds =>
        currentIds.filter(todoId => todoId !== todoDeleteId),
      );
    }
  };

  const handleDeleteAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleUpdateTodo = async (updatingTodo: Todo): Promise<boolean> => {
    setLoading(true);
    setLoadingIds(currentIds => [...currentIds, updatingTodo.id]);
    try {
      const newTodo = await updateTodo(updatingTodo);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === newTodo.id ? newTodo : todo)),
      );

      return true;
    } catch (err) {
      setError(ErrorType.UpdateTodo);

      return false;
    } finally {
      setLoading(false);
      setLoadingIds(currentIds =>
        currentIds.filter(todoId => todoId !== updatingTodo.id),
      );
    }
  };

  const handleUpdateStatusAll = () => {
    if (todos.some(todo => !todo.completed)) {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleUpdateTodo({ ...todo, completed: !todo.completed });
        }
      });
    } else if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => {
        if (todo.completed) {
          handleUpdateTodo({ ...todo, completed: !todo.completed });
        }
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleAddTodo={handleAddTodo}
          handleUpdateStatusAll={handleUpdateStatusAll}
          isAllCompleted={isAllCompleted}
          isTodosNotEmpty={isTodosNotEmpty}
          loading={loading}
        />

        <TodoList
          todos={filteredTodos}
          loading={loading}
          loadingIds={loadingIds}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            isSomeCompleted={isSomeCompleted}
            counterNotCompleted={counterNotCompleted}
            loading={loading}
            handleDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      <ErrorInfo errorMessage={error} setError={setError} />
    </div>
  );
};
