/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, updateTodoStatus } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorList } from './components/ErrorList/ErrorList';
import {
  TodoFilter,
  FilterTodoStatus,
} from './components/TodoFilter/TodoFilter';
import { TodoForm, TodoFormProps } from './components/TodoForm/TodoForm';

import { ErrorTypes } from './types/ErrorTypes';

const USER_ID = 6848;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filter, setFilter] = useState<FilterTodoStatus>(FilterTodoStatus.ALL);
  const [errors, setErrors] = useState<string>('');
  const [editedTodosIds, setEditedTodosIds] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((result) => setTodos(result))
      .catch(() => setErrors(ErrorTypes.LOAD));
  }, []);

  const activeTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some((todo) => todo.completed),
    [todos],
  );

  const areAllCompleted = useMemo(() => {
    return todos.every((todo) => todo.completed);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filter === FilterTodoStatus.ALL
      ? todos
      : todos.filter((todo) => {
        switch (filter) {
          case FilterTodoStatus.ACTIVE:
            return !todo.completed;

          case FilterTodoStatus.COMPLETED:
            return todo.completed;

          default:
            return true;
        }
      });
  }, [todos, filter]);

  const handleSuccess = useCallback<TodoFormProps['onSuccess']>((todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
    setTempTodo(null);
  }, []);

  const handleErrorAdd = useCallback<TodoFormProps['onError']>(
    (errorMessage: string) => {
      setTempTodo(null);

      setErrors(errorMessage);
    },
    [],
  );

  const handleTempTodo = useCallback<TodoFormProps['onTempTodo']>((todo) => {
    setTempTodo(todo);
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setEditedTodosIds((prevState) => [...prevState, todoId]);
      const response = await deleteTodo(todoId);

      if (response === 0) {
        throw new Error(ErrorTypes.DELETE);
      }

      const newTodos = todos.filter((todo) => todo.id !== todoId);

      setTodos([...newTodos]);
    } catch {
      setErrors(ErrorTypes.DELETE);
    } finally {
      setEditedTodosIds(
        editedTodosIds.filter((deletedTodoId) => deletedTodoId !== todoId),
      );
    }
  };

  const resetErrorHandler = useCallback(() => {
    setErrors('');
  }, []);

  const handleClearCompleted = async () => {
    const tasks: Promise<void>[] = [];

    todos
      .filter((todo) => todo.completed)
      .forEach((todo) => {
        handleDeleteTodo(todo.id);
        tasks.push(deleteTodo(todo.id) as Promise<void>);
      });

    await Promise.all(tasks);

    const result = todos.filter((todo) => !todo.completed);

    setTodos([...result]);
  };

  const handleUpdateTodoStatus = async (todo: Todo) => {
    try {
      setEditedTodosIds((prevState) => [...prevState, todo.id]);

      await updateTodoStatus(todo.id, !todo.completed);

      const newTodos = todos.map((mappedTodo) => {
        const { id, completed } = mappedTodo;

        if (id === todo.id) {
          return {
            ...mappedTodo,
            completed: !completed,
          };
        }

        return mappedTodo;
      });

      setTodos([...newTodos]);
    } catch {
      setErrors(ErrorTypes.UPDATE);
    } finally {
      setEditedTodosIds(editedTodosIds.filter((todoId) => todoId !== todo.id));
    }
  };

  const handleChangeAll = async () => {
    const tasks: Promise<Todo>[] = [];
    let result: Todo[] = [];

    try {
      if (areAllCompleted) {
        todos.forEach((todo) => {
          setEditedTodosIds((prevState) => [...prevState, todo.id]);

          tasks.push(updateTodoStatus(todo.id, false));
          result = todos.map((mappedTodo) => ({
            ...mappedTodo,
            completed: false,
          }));
        });
      } else {
        todos
          .filter((todo) => !todo.completed)
          .forEach((todo) => {
            setEditedTodosIds((prevState) => [...prevState, todo.id]);

            tasks.push(updateTodoStatus(todo.id, false));

            result = todos.map((mappedTodo) => ({
              ...mappedTodo,
              completed: true,
            }));
          });
      }

      await Promise.all(tasks);

      setTodos([...result]);
    } catch {
      setErrors(ErrorTypes.UPDATE);
    } finally {
      setEditedTodosIds([]);
    }
  };

  const handleEditTitleError = () => {
    setErrors(ErrorTypes.UPDATE);
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
            className={classNames('todoapp__toggle-all', {
              active: areAllCompleted,
            })}
            onClick={() => handleChangeAll()}
          />
          <TodoForm
            userId={USER_ID}
            onError={handleErrorAdd}
            onSuccess={handleSuccess}
            onTempTodo={handleTempTodo}
            handleSelectAll={handleChangeAll}
          />
        </header>

        {todos.length !== 0 && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                deleteTodo={handleDeleteTodo}
                deletedTodos={editedTodosIds}
                handleUpdateTodoStatus={handleUpdateTodoStatus}
                handleEditTitleError={handleEditTitleError}
              />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <TodoFilter filter={filter} onFilterChange={setFilter} />

              {hasCompletedTodos && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <ErrorList errors={errors} onClear={resetErrorHandler} />
    </div>
  );
};
