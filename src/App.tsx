import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
  TodoChanges,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos } from './utils/getVisibleTodos';

const ERROR_DISPLAY_DURATION = 3000;

type TodoError = {
  message: ErrorMessage;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<TodoError | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let isCancelled = false;

    setError(null);

    getTodos()
      .then(loadedTodos => {
        if (!isCancelled) {
          setTodos(loadedTodos);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError({ message: ErrorMessage.Load });
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
    }, ERROR_DISPLAY_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error]);

  useEffect(() => {
    if (!isLoading && !tempTodo) {
      inputRef.current?.focus();
    }
  }, [isLoading, tempTodo]);

  const handleCloseError = () => {
    setError(null);
  };

  const startProcessing = (todoId: number) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);
    setError(null);
  };

  const finishProcessing = (todoId: number) => {
    setProcessingIds(currentIds => {
      return currentIds.filter(id => id !== todoId);
    });
  };

  const handleAdd = async (newTitle: string) => {
    setError(null);

    if (!newTitle) {
      setError({ message: ErrorMessage.EmptyTitle });
      inputRef.current?.focus();

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    try {
      const createdTodo = await addTodo(newTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setError({ message: ErrorMessage.Add });
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number): Promise<boolean> => {
    startProcessing(todoId);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => {
        return currentTodos.filter(({ id }) => id !== todoId);
      });

      inputRef.current?.focus();

      return true;
    } catch {
      setError({ message: ErrorMessage.Delete });

      return false;
    } finally {
      finishProcessing(todoId);
    }
  };

  const handleUpdate = async (
    todoId: number,
    changes: TodoChanges,
  ): Promise<boolean> => {
    startProcessing(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, changes);

      setTodos(currentTodos => {
        return currentTodos.map(todo => {
          if (todo.id !== todoId) {
            return todo;
          }

          return {
            ...todo,
            ...updatedTodo,
          };
        });
      });

      return true;
    } catch {
      setError({ message: ErrorMessage.Update });

      return false;
    } finally {
      finishProcessing(todoId);
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(({ id, completed }) => {
        return completed && !processingIds.includes(id);
      })
      .forEach(({ id }) => {
        void handleDelete(id);
      });
  };

  const handleToggleAll = () => {
    const nextCompleted = !todos.every(({ completed }) => completed);

    todos
      .filter(({ id, completed }) => {
        return completed !== nextCompleted && !processingIds.includes(id);
      })
      .forEach(({ id }) => {
        void handleUpdate(id, { completed: nextCompleted });
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const hasTodos = todos.length > 0;
  const hasCompletedTodos = todos.some(({ completed }) => completed);
  const allTodosCompleted = hasTodos && activeTodosCount === 0;
  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          allTodosCompleted={allTodosCompleted}
          title={title}
          isDisabled={isLoading || tempTodo !== null}
          isToggleDisabled={processingIds.length > 0}
          inputRef={inputRef}
          onTitleChange={setTitle}
          onAdd={handleAdd}
          onToggleAll={handleToggleAll}
        />

        {(hasTodos || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}

        {hasTodos && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={error?.message ?? ErrorMessage.None}
        onClose={handleCloseError}
      />
    </div>
  );
};
