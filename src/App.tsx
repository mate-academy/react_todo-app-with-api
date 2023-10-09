/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { Error, Filter, Todo } from './types/Todo';
import * as todosService from './api/todos';

export const USER_ID = 11041;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(Error.NOTHING);
  const [filterTodos, setFilterTodos] = useState(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then((data) => setTodos(data))
      .catch(() => setHasError(Error.FETCH));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterTodos) {
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [filterTodos, todos]);

  const deleteTodo = async (todoId: number) => {
    setLoadingIds((ids) => {
      return [...ids, todoId];
    });

    try {
      await todosService.deleteTodos(todoId);

      setTodos((prevTodos) => {
        return prevTodos.filter(t => t.id !== todoId);
      });
    } catch (error) {
      setHasError(Error.DELETE);
    }

    setLoadingIds((ids) => {
      return ids.filter(id => id !== todoId);
    });
  };

  const addTodo = async (title: string) => {
    const todoToAdd = {
      completed: false,
      title,
      userId: USER_ID,
    };

    setLoadingIds([0, ...loadingIds]);
    setTempTodo({ id: 0, ...todoToAdd });

    try {
      const createdTodo = await todosService.addTodos(todoToAdd);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setTempTodo(null);
      setHasError(Error.ADD);
      throw error;
    }

    setTempTodo(null);
    setLoadingIds((ids) => {
      return ids.filter(id => id !== 0);
    });
  };

  const updateTodo = async (todoId: number, args: Partial<Todo>) => {
    setHasError(Error.NOTHING);

    setLoadingIds((ids) => {
      return [...ids, todoId];
    });

    try {
      const updatedTodo = await todosService.updateTodo(todoId, args);

      setTodos((prevTodos) => {
        return prevTodos.map((currentTodo) => {
          if (currentTodo.id === todoId) {
            return updatedTodo;
          }

          return currentTodo;
        });
      });
    } catch (error) {
      setHasError(Error.UPDATE);
    }

    setLoadingIds((ids) => {
      return ids.filter(id => id !== todoId);
    });
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    setLoadingIds(completedTodos.map(todo => todo.id));

    await Promise.all(completedTodos.map(async (todo) => {
      try {
        await todosService.deleteTodos(todo.id);
      } catch (error) {
        setHasError(Error.DELETE);
        throw error;
      }
    }));
    setLoadingIds([]);
    setTodos(uncompletedTodos);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          setTodos={setTodos}
          addTodo={addTodo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          isTempTodoExist={!!tempTodo}
          setHasError={setHasError}
        />
        <TodoList
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
          filteredTodos={filteredTodos}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {hasError !== Error.NOTHING && (
        <TodoNotification
          hasError={hasError}
          setHasError={setHasError}
        />
      )}
    </div>
  );
};
