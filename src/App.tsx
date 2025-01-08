import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { Header } from './commponents/Header';
import { Footer } from './commponents/Footer';
import { Errors } from './commponents/Errors';
import { TodoCard } from './commponents/TodoCard';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/Errors';
import { LoadingTodo } from './types/LoadingTodo';
import { loadingTodo } from './utils/loadingTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Status>(Status.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.EmptyTitle);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoLoading, setTodoLoading] = useState<LoadingTodo>({});

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setErrorType(ErrorType.EmptyTitle),
      3000,
    );

    getTodos()
      .then(setTodos)

      .catch(() => {
        setErrorType(ErrorType.UnableToLoad);
        clearTimeout(timeoutId);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  const todoFilter = todos.filter(todo => {
    switch (filterType) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddNewTodo = useCallback(
    async (todoToAdd: Todo): Promise<void> => {
      setTempTodo(todoToAdd);

      try {
        const todoNew = await addTodo(todoToAdd);

        setTodos(currentTodos => [...currentTodos, todoNew]);
      } catch {
        setErrorType(ErrorType.UnableToAdd);
      } finally {
        setTempTodo(null);
      }
    },
    [setTodos, setTempTodo, setErrorType],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: number): Promise<void> => {
      try {
        await deleteTodo(todoId);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      } catch {
        setErrorType(ErrorType.UnableToDelete);
      } finally {
        setTempTodo(null);
      }
    },
    [setTodos, setErrorType, setTempTodo],
  );

  const handleUpdateTodo = useCallback(
    async (
      updateTodoItem: Todo,
      key: keyof Todo,
      value: boolean | string,
    ): Promise<boolean> => {
      try {
        const todoUpdated = await updateTodo({
          ...updateTodoItem,
          [key]: value,
        });

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updateTodoItem.id ? todoUpdated : todo,
          ),
        );

        return false;
      } catch {
        setErrorType(ErrorType.UnableToUpdate);

        return true;
      }
    },
    [setTodos, setErrorType],
  );

  const removeCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodoLoading(loadingTodo(completedTodos));

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.forEach(val => {
          if (val.status === 'rejected') {
            setErrorType(ErrorType.UnableToDelete);
          } else {
            setTodos(currentTodos => {
              const todoId = val.value as Todo;

              return currentTodos.filter(todo => todo.id !== todoId.id);
            });
          }
        });
      })
      .finally(() => setTodoLoading({}));
  }, [todos, setTodoLoading, setTodos, setErrorType]);

  const manageCompletedTodos = useCallback(async () => {
    const completedAllTodos = async (
      targetTodos: Todo[],
      completed: boolean,
    ) => {
      try {
        await Promise.all(
          targetTodos.map(todo => updateTodo({ ...todo, completed })),
        );

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            targetTodos.some(t => t.id === todo.id)
              ? { ...todo, completed }
              : todo,
          ),
        );
      } catch {
        setErrorType(ErrorType.UnableToUpdate);
      } finally {
        setTodoLoading({});
      }
    };

    const activeTodos = todos.filter(todo => !todo.completed);

    if (activeTodos.length) {
      setTodoLoading(loadingTodo(activeTodos));
      await completedAllTodos(activeTodos, true);
    } else {
      setTodoLoading(loadingTodo(todos));
      await completedAllTodos(todos, false);
    }
  }, [todos, setTodos, setErrorType, setTodoLoading]);

  const lengthOfTodo = todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorType={setErrorType}
          onChangeTodoTask={setTempTodo}
          tempTodo={tempTodo}
          onAddNewTodo={handleAddNewTodo}
          manageCompletedTodos={manageCompletedTodos}
          lengthOfTodo={lengthOfTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {todoFilter.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
              todoLoading={todoLoading}
            />
          ))}

          {tempTodo && (
            <TodoCard
              todo={tempTodo}
              handleUpdateTodo={handleUpdateTodo}
              handleDeleteTodo={handleDeleteTodo}
              todoLoading={todoLoading}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            onFiltered={setFilterType}
            todos={todos}
            removeCompletedTodos={removeCompletedTodos}
            setTodoLoading={setTodoLoading}
          />
        )}
      </div>

      <Errors
        errorType={errorType}
        clearError={() => setErrorType(ErrorType.EmptyTitle)}
      />
    </div>
  );
};
