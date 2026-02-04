/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState, useRef } from 'react';

import { FilterStatus } from './types/FilterStatus';
import { createTodos, getTodos, patchTodo, USER_ID } from './api/todos';
import { deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { TodoItem } from './components/TodoItem/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const headerRef = useRef<HTMLInputElement>(null);

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const handleCloseError = () => {
    setErrorMessage(ErrorMessage.Default);
  };

  const handleShowError = (error: ErrorMessage) => {
    setErrorMessage(error);
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
        headerRef.current?.focus();
      })
      .catch(() => {
        handleShowError(ErrorMessage.DeleteMessage);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleUpdateTodo = (id: number, data: Todo) => {
    setProcessingIds(prev => [...prev, id]);

    return patchTodo(id, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        handleShowError(ErrorMessage.UpdateMessage);

        return Promise.reject();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleToggleTodos = (status: boolean) => {
    const allUpdateTodos = todos.filter(todo => todo.completed === !status);

    const neededUpdateIds = allUpdateTodos.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...neededUpdateIds]);

    const promises = allUpdateTodos.map(todo => {
      return patchTodo(todo.id, { ...todo, completed: status })
        .then(responseTodo => {
          setTodos(currentTodos =>
            currentTodos.map(t =>
              t.id === responseTodo.id ? responseTodo : t,
            ),
          );

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev =>
            prev.filter(processingId => processingId !== todo.id),
          );
        });
    });

    Promise.all(promises).then(results => {
      if (results.includes(false)) {
        handleShowError(ErrorMessage.UpdateMessage);
      }
    });
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodosIds = todos.filter(todo => todo.completed);
    const completedTodosList = completedTodosIds.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedTodosList]);
    const promises: Promise<boolean>[] = completedTodosList.map(completedId => {
      return deleteTodo(completedId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== completedId),
          );

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev =>
            prev.filter(currentId => currentId !== completedId),
          );
        });
    });

    Promise.all(promises).then(result => {
      if (result.some(el => el === false)) {
        handleShowError(ErrorMessage.DeleteMessage);
      }

      headerRef.current?.focus();
    });
  };

  const handleCreateTodo = (title: string): Promise<void> => {
    const titleTrimmed = title.trim();

    if (titleTrimmed.length === 0) {
      handleShowError(ErrorMessage.TitleEmpty);

      return Promise.reject();
    }

    if (headerRef.current) {
      headerRef.current.disabled = true;
    }

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: titleTrimmed,
      completed: false,
    };

    setTempTodo(todo);

    //pass on the server
    return createTodos(titleTrimmed)
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch(() => {
        handleShowError(ErrorMessage.AddMessage);
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
        if (headerRef.current) {
          headerRef.current.disabled = false;
          headerRef.current.focus();
        }
      });
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadMessage));
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.All:
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={headerRef}
          onCreateTodo={handleCreateTodo}
          onToggleTodos={handleToggleTodos}
          todosCountInfo={[todos.length, activeCount]}
        />
        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
            onPatch={handleUpdateTodo}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isLoading={true}
            onPatch={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodo={handleDeleteCompletedTodos}
            completedTodos={completedTodos}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        onCloseError={handleCloseError}
      />
    </div>
  );
};
