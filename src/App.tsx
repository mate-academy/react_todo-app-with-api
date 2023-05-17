import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterTodos } from './components/FilterTodos';
import { Form } from './components/Form';
import { NotificationError } from './components/NotificationError';

import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

const USER_ID = 10210;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorType.LOAD);
    }
  };

  const postTodo = useCallback(async (newTitle: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        completed: false,
        title: newTitle,
      };
      const temp = { ...newTodo, id: 0 };

      setLoading(true);
      setTempTodo(temp);
      await addTodo(newTodo);
      await getTodosFromServer();
      setTitle('');
    } catch {
      setError(ErrorType.ADD);
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  }, []);

  const handleAddTodo = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(ErrorType.EMPTY);

      return;
    }

    postTodo(title);
  }, [title]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setProcessingIds(currentIds => [...currentIds, todoId]);
      await deleteTodo(todoId);
      await getTodosFromServer();
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setProcessingIds(currentIds => currentIds.slice(1));
    }
  }, []);

  const clearCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const todoUpdate = useCallback(async (todoId: number, data: unknown) => {
    try {
      setProcessingIds(currentIds => [...currentIds, todoId]);
      await updateTodo(todoId, data);
      await getTodosFromServer();
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingIds(currentIds => currentIds.slice(1));
    }
  }, []);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const handleToggleAll = useCallback(async () => {
    try {
      await Promise.all(todos.map(async (todo) => {
        if (!todo.completed || !activeTodosCount) {
          setProcessingIds(currentIds => [...currentIds, todo.id]);

          await updateTodo(todo.id, { completed: !todo.completed });
        }
      }));

      await getTodosFromServer();
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingIds([]);
    }
  }, [processingIds, todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterType]);

  const isCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Form
          loading={loading}
          activeTodosCount={activeTodosCount}
          todosExist={!!todos.length}
          title={title}
          post={handleAddTodo}
          setTitle={setTitle}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          removeTodo={removeTodo}
          onTodoUpdate={todoUpdate}
        />

        {!!todos.length && (
          <FilterTodos
            activeTodosCount={activeTodosCount}
            isCompletedTodos={isCompletedTodos}
            filterType={filterType}
            onFilter={setFilterType}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <NotificationError error={error} setError={setError} />
    </div>
  );
};
