/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { Filter } from './components/Filter';
import { TodoForm } from './components/TodoForm';
import { Notifications } from './components/Notifications';
import { TodoList } from './components/TodoList';
import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';
import {
  getTodos, createTodo, removeTodo, updateTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';

const USER_ID = 10873;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosFromServer: Todo[] = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setError('Unable to get todos');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (error) {
      timeoutId = setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterOptions.ACTIVE:
        return activeTodos;

      case FilterOptions.COMPLETED:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const updateTodoInfo = async (
    todoId: number,
    newTodoData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      const updatedTodo = await updateTodo(todoId, newTodoData);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleToggleAllButton = () => {
    todos.forEach(async (todo) => {
      await updateTodoInfo(
        todo.id,
        { completed: !isAllTodosCompleted },
      );
    });
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompletedButton = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
    } catch {
      setError('Unable to delete todos');
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            onClick={handleToggleAllButton}
          />
          <TodoForm setError={setError} addTodo={addTodo} tempTodo={tempTodo} />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodoInfo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <Filter filter={filter} setFilter={setFilter} />

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleDeleteCompletedButton}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <Notifications error={error} setError={setError} />
    </div>
  );
};
