import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoError,
  TodoServiceError,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { StatusFilterOptions } from './components/StatusFilter';
import { TodoCreateForm } from './components/TodoCreateForm';
import cn from 'classnames';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

interface GetFilteredTodosFilters {
  status: StatusFilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFilters) => {
  switch (filter.status) {
    case StatusFilterOptions.Completed:
      return todos.filter(todo => todo.completed);

    case StatusFilterOptions.Active:
      return todos.filter(todo => !todo.completed);

    case StatusFilterOptions.All:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(StatusFilterOptions.All);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  const createFormRef = useRef<HTMLInputElement>(null);

  const handleAddTodoToProcessing = (todoId: number) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoFromProcessing = (todoId: number) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const showComponent = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, {
    status: statusFilter,
  });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodosAmount = todos.length - completedTodos.length;
  const activeButton = todos.length === completedTodos.length;

  useEffect(() => {
    setTodosLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodoServiceError.UnableToLoad);
      })
      .finally(() => setTodosLoading(false));
  }, []);

  const handleAddTodo = useCallback((title: string) => {
    if (createFormRef.current) {
      createFormRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTemporaryTodo({
      id: 0,
      ...newTodo,
    });

    return createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(current => [...current, todoFromServer]);
      })
      .catch(() => {
        setErrorMessage(TodoServiceError.UnableToAdd);

        throw new Error(TodoServiceError.UnableToAdd);
      })
      .finally(() => {
        setTemporaryTodo(null);

        if (createFormRef.current) {
          createFormRef.current.disabled = false;
          createFormRef.current.focus();
        }
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: number) => {
    handleAddTodoToProcessing(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(TodoServiceError.UnableToDelete);
      })
      .finally(() => {
        handleRemoveTodoFromProcessing(todoId);
      });

    createFormRef.current?.focus();
  }, []);

  const handleUpdateTodo = useCallback(
    (todoId: number, modifiedTodo: Omit<Todo, 'id'>) => {
      handleAddTodoToProcessing(todoId);

      return updateTodo(todoId, modifiedTodo)
        .then(updatedTodo => {
          setTodos(current =>
            current.map(todo => {
              return todo.id === todoId ? updatedTodo : todo;
            }),
          );
        })
        .catch(() => {
          setErrorMessage(TodoServiceError.UnableToUpdate);

          throw new Error(TodoServiceError.UnableToUpdate);
        })
        .finally(() => {
          handleRemoveTodoFromProcessing(todoId);
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

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {showComponent && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length && activeButton,
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

        {!todosLoading && (
          <>
            <TodoList
              todos={filteredTodos}
              temporaryTodo={temporaryTodo}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
              processingTodoIds={processingTodoIds}
            />

            <Footer
              show={showComponent}
              activeTodosAmount={activeTodosAmount}
              completedTodos={completedTodos}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              handleClearCompleted={handleClearCompleted}
            />
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
