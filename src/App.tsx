/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodoError,
  todosService,
  TodosServiceError,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { useErrorMessage } from './hooks/useErrorMessage';
import { StatusFilter, TodoStatus } from './components/StatusFilter';
import cn from 'classnames';
// import { use } from 'chai';
import { AddTodoForm, AddTodoFormData } from './components/AddTodoForm';
import { TodoCreate } from './types/TodoCreate';
import { TodoUpdate } from './types/Todo.Update';
// import { has } from 'cypress/types/lodash';

function getFilteredTodos(todos: Todo[], { status }: { status: TodoStatus }) {
  let filteredTodos = todos;

  if (status !== TodoStatus.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (status) {
        case TodoStatus.Completed:
          return todo.completed;
        case TodoStatus.Active:
          return !todo.completed;
        default:
          throw new Error('Missing case in getFilteredTodos status filter');
      }
    });
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const newTodoTitleRef = useRef<HTMLInputElement>(null);

  const { error, setError, resetErrorMessage } = useErrorMessage();

  const showTodosAndFooter = todos.length > 0;
  const showToggleAllButton = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, { status: statusFilter });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;

  const allCompleted =
    todos.length > 0 && completedTodos.length === todos.length;
  const hasCompleted = completedTodos.length > 0;

  const isTodoLoading = useCallback(
    (todoId: number) => loadingTodoIds.includes(todoId),
    [loadingTodoIds],
  );

  const handleAddToLoading = useCallback((todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);
  }, []);

  const handleRemoveFromLoading = useCallback((todoId: number) => {
    setLoadingTodoIds(current => current.filter(id => id !== todoId));
  }, []);

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      handleAddToLoading(todoId);
      todosService
        .delete(todoId)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          setError(getTodoError(TodosServiceError.UnableToDeleteATodo));
        })
        .finally(() => {
          handleRemoveFromLoading(todoId);
          newTodoTitleRef.current?.focus();
        });
    },
    [newTodoTitleRef, handleAddToLoading, handleRemoveFromLoading, setError],
  );

  const handleClearComplete = useCallback(() => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  const handleCreateTodo = useCallback(
    (
      values: AddTodoFormData,
      {
        onSuccess,
        onError,
      }: {
        onSuccess?: (createTodoDto: Todo) => void;
        onError?: () => void;
      } = {},
    ) => {
      if (newTodoTitleRef.current) {
        newTodoTitleRef.current.focus();
      }

      const createTodoDto: TodoCreate = {
        title: values.title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...createTodoDto,
      });

      setIsCreatingTodo(true);

      todosService
        .create(createTodoDto)
        .then(createdTodo => {
          setTempTodo(null);
          setTodos(current => [...current, createdTodo]);

          onSuccess?.(createdTodo);
        })
        .catch(() => {
          setTempTodo(null);
          setError(getTodoError(TodosServiceError.UnableToAddATodo));

          onError?.();
        })
        .finally(() => {
          setIsCreatingTodo(false);

          if (newTodoTitleRef.current) {
            newTodoTitleRef.current.disabled = false;
          }

          newTodoTitleRef.current?.focus();
        });
    },
    [newTodoTitleRef, setError],
  );

  const handleUpdateTodo = useCallback(
    (
      todoId: number,
      data: TodoUpdate,
      {
        onSuccess,
        onError,
      }: { onSuccess?: (updatedTodo: Todo) => void; onError?: () => void } = {},
    ) => {
      handleAddToLoading(todoId);

      todosService
        .update(todoId, data)
        .then(updatedTodo => {
          setTodos(current =>
            current.map(todo => {
              return todo.id === updatedTodo.id ? updatedTodo : todo;
            }),
          );

          onSuccess?.(updatedTodo);
        })
        .catch(() => {
          setError(getTodoError(TodosServiceError.UnableToUpdateATodo));

          onError?.();
        })
        .finally(() => {
          handleRemoveFromLoading(todoId);
        });
    },
    [handleAddToLoading, handleRemoveFromLoading, setError],
  );

  const handleBulkToggleStatus = useCallback(() => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(({ id, ...todo }) => {
        handleUpdateTodo(id, {
          title: todo.title,
          userId: todo.userId,
          completed: !todo.completed,
        });
      });

      return;
    }

    todos.forEach(({ id, ...todo }) => {
      handleUpdateTodo(id, {
        title: todo.title,
        userId: todo.userId,
        completed: !todo.completed,
      });
    });
  }, [todos, activeTodos, handleUpdateTodo]);

  useEffect(() => {
    resetErrorMessage();
    setLoading(true);

    todosService
      .list()
      .then((todosFromServer: Todo[]) => setTodos(todosFromServer))
      .catch(() => {
        setError(getTodoError(TodosServiceError.UnableToLoadTodos));
      })
      .finally(() => setLoading(false));
  }, [resetErrorMessage, setError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {showToggleAllButton && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              disabled={loading}
              onClick={handleBulkToggleStatus}
            />
          )}

          <AddTodoForm
            ref={newTodoTitleRef}
            onError={setError}
            onSubmit={handleCreateTodo}
            loading={isCreatingTodo}
          />
        </header>

        {showTodosAndFooter && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  loading={isTodoLoading(todo.id)}
                  onUpdate={handleUpdateTodo}
                />
              ))}
              {tempTodo && (
                <TodoItem todo={tempTodo} loading onDelete={() => undefined} />
              )}
            </section>

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodosCount} items left
                </span>

                <StatusFilter
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={!hasCompleted}
                  onClick={handleClearComplete}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <ErrorNotification notification={error} onClose={resetErrorMessage} />
    </div>
  );
};
