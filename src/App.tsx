import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { ERRORS, Todo, FilterType } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const isAllCompleted = todos.length > 0 && activeCount === 0;
  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ERRORS.LOAD));
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      switch (hash) {
        case '#/active':
          setFilter(FilterType.Active);
          break;
        case '#/completed':
          setFilter(FilterType.Completed);
          break;
        default:
          setFilter(FilterType.All);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleAddTodo = (title: string) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    });

    return createTodo(title)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setErrorMessage(ERRORS.ADD);
        setTempTodo(null);
        throw error;
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        todoInputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ERRORS.DELETE);
      })
      .finally(() =>
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId)),
      );
  };

  const handleUpdateTodo = (todoId: number, dataQuery: Partial<Todo>) => {
    setLoadingTodoIds(currentTodos => [...currentTodos, todoId]);

    return updateTodo(todoId, dataQuery)
      .then(() => {
        return setTodos(currentTodos => {
          return currentTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, ...dataQuery };
            }

            return todo;
          });
        });
      })
      .catch(error => {
        setErrorMessage(ERRORS.UPDATE);
        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId)),
      );
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [...currentIds, ...idsToDelete]);

    Promise.all(
      completedTodos.map(todo => {
        return deleteTodo(todo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
            );
          })
          .catch(() => setErrorMessage(ERRORS.DELETE))
          .finally(() => {
            setLoadingTodoIds(currentIds =>
              currentIds.filter(id => id !== todo.id),
            );
          });
      }),
    ).then(() => {
      todoInputRef.current?.focus();
    });
  };

  const handleToggleAll = () => {
    const shouldBeCompleted = !isAllCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToToggle = todosToUpdate.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [...currentIds, ...idsToToggle]);

    Promise.all(
      todosToUpdate.map(todo => {
        return updateTodo(todo.id, { completed: shouldBeCompleted });
      }),
    )
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (idsToToggle.includes(todo.id)) {
              return { ...todo, completed: shouldBeCompleted };
            }

            return todo;
          }),
        );
      })
      .catch(() => setErrorMessage(ERRORS.UPDATE))
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => !idsToToggle.includes(id)),
        );
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          allCompleted={isAllCompleted}
          loading={tempTodo !== null}
          inputRef={todoInputRef}
          hasTodos={todos.length > 0}
          addTodo={handleAddTodo}
          onError={setErrorMessage}
          onToggleAll={handleToggleAll}
        />
        {(todos.length > 0 || tempTodo) && (
          <TodoList
            visibleTodos={visibleTodos}
            loadingTodoIds={loadingTodoIds}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            completedCount={completedCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
        <ErrorNotification
          errorMessage={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      </div>
    </div>
  );
};
