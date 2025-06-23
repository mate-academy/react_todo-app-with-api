/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodos,
  getTodos,
  TodoError,
  TodoServiceErrors,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { StatusFilter, StatusFilterOptions } from './components/StatusFilter';
import { TodoCreateForm } from './components/TodoCreateForm';
import { TodoModify } from './types/TodoModify';

import cn from 'classnames';

interface GetFilteredTodosFiltres {
  status: StatusFilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFiltres) => {
  let filteredTodos = [...todos];

  if (filter.status !== StatusFilterOptions.All) {
    filteredTodos = filteredTodos.filter(todo => {
      return filter.status === StatusFilterOptions.Completed
        ? todo.completed
        : !todo.completed;
    });
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(StatusFilterOptions.All);
  const [processingTodosIds, setProcessingTodosIds] = useState<Todo['id'][]>(
    [],
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const createFormRef = useRef<HTMLInputElement>(null);

  const handleAddToProcessing = (todoId: Todo['id']) => {
    setProcessingTodosIds(prev => [...prev, todoId]);
  };

  const handleRemoveProcessing = (todoId: Todo['id']) => {
    setProcessingTodosIds(prev => prev.filter(id => id !== todoId));
  };

  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const filteredTodos = getFilteredTodos(todos, {
    status: statusFilter,
  });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodosAmount = todos.length - completedTodos.length;

  const handleAddTodo = useCallback((title: Todo['title']) => {
    setErrorMessage(null);

    const titleTrimed = title.trim();

    if (createFormRef.current) {
      createFormRef.current.disabled = true;
    }

    const newTodo: TodoModify = {
      title: titleTrimed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    return createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(prev => [...prev, todoFromServer]);
      })
      .catch(() => {
        setErrorMessage(TodoServiceErrors.UnableToAdd);

        throw new Error(TodoServiceErrors.UnableToAdd);
      })
      .finally(() => {
        setTempTodo(null);

        if (createFormRef.current) {
          createFormRef.current.disabled = false;
          createFormRef.current.focus();
        }
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: Todo['id']) => {
    handleAddToProcessing(todoId);
    deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(TodoServiceErrors.UnableToDelete);

        throw new Error(TodoServiceErrors.UnableToDelete);
      })
      .finally(() => {
        handleRemoveProcessing(todoId);
        if (createFormRef.current) {
          createFormRef.current.focus();
        }
      });
  }, []);

  const handleUpdateTodo = useCallback(
    (todoId: Todo['id'], modifiedTodo: TodoModify) => {
      handleAddToProcessing(todoId);

      return updateTodo(todoId, modifiedTodo)
        .then(updatedTodo => {
          setTodos(prev =>
            prev.map(todo => {
              return todo.id === updatedTodo.id ? updatedTodo : todo;
            }),
          );
        })
        .catch(() => {
          setErrorMessage(TodoServiceErrors.UnableToUpdate);

          throw new Error(TodoServiceErrors.UnableToUpdate);
        })
        .finally(() => {
          handleRemoveProcessing(todoId);
          if (createFormRef.current) {
            createFormRef.current.focus();
          }
        });
    },
    [],
  );

  const handleToggleAllStatus = useCallback(() => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (activeTodos.length) {
      activeTodos.forEach(activeTodo => {
        handleUpdateTodo(activeTodo.id, {
          title: activeTodo.title,
          userId: activeTodo.userId,
          completed: true,
        });
      });
    } else {
      todos.forEach(todo => {
        handleUpdateTodo(todo.id, {
          title: todo.title,
          userId: todo.userId,
          completed: !todo.completed,
        });
      });
    }
  }, [todos, handleUpdateTodo]);

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(completedTodo => {
      handleDeleteTodo(completedTodo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodoServiceErrors.UnableToLoad);
      })
      .finally(() => setIsTodosLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isTodosLoading && todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length === completedTodos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllStatus}
            />
          )}

          <TodoCreateForm
            ref={createFormRef}
            onSubmit={handleAddTodo}
            onError={setErrorMessage}
          />
        </header>

        {!isTodosLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={handleDeleteTodo}
                  onUpdateTodo={handleUpdateTodo}
                  isLoading={processingTodosIds.includes(todo.id)}
                />
              ))}

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onDeleteTodo={() => {}}
                  onUpdateTodo={() => {
                    return Promise.resolve();
                  }}
                  isLoading
                />
              )}
            </section>

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodosAmount} items left
                </span>

                <StatusFilter
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                />
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={handleClearCompleted}
                  disabled={completedTodos.length === 0}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
