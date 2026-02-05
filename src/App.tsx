/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/errorMessages';

import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/errorNotification';

import { FilterStatus } from './utils/filterStatus';
import { getVisibleTodos } from './utils/getVisibleTodos';


export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [query, setQuery] = React.useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.NoLoad);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filter);
  }, [todos, filter]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      setErrorMessage('');

      if (!query.trim()) {
        setErrorMessage(ErrorMessage.NoTitle);

        inputRef.current?.focus();

        return;
      }

      setIsSubmitting(true);

      setTempTodo({
        id: 0,
        title: query.trim(),
        completed: false,
        userId: 3876,
      });

      const title = query.trim();

      createTodo({ title, completed: false, userId: 3876 })
        .then(newTodo => {
          setTodos(prev => [...prev, newTodo]);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.NoTodo);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    },
    [query],
  );

  const handleDelete = useCallback((todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.NoDelete);
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  }, []);

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  }, [todos, handleDelete]);

  const updateTodoItem = useCallback(
    (todoId: number, dataToUpdate: Partial<Todo>) => {
      setIsLoading(currentIds => [...currentIds, todoId]);

      return updateTodo(todoId, dataToUpdate)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
          );

          return updatedTodo;
        })
        .catch(error => {
          setErrorMessage(ErrorMessage.NoUpdate);
          throw error;
        })
        .finally(() => {
          setIsLoading(currentIds => currentIds.filter(id => id !== todoId));
        });
    },
    [],
  );

  const handleRename = useCallback((todo: Todo, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      handleDelete(todo.id);

      return;
    }

    updateTodoItem(todo.id, { title: trimmedTitle })
      .then(() => setEditingId(null))
      .catch(() => setErrorMessage(ErrorMessage.NoUpdate));
  }, [handleDelete, updateTodoItem]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const uncompletedCount = todos.filter(todo => !todo.completed).length;

  const onToggleAll = useCallback(() => {
    const areAllCompleted = todos.length === completedCount;
    const targetStatus = !areAllCompleted;

    todos.forEach(todo => {
      if (todo.completed !== targetStatus) {
        updateTodoItem(todo.id, { completed: targetStatus });
      }
    });
  }, [completedCount, todos, updateTodoItem]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
          completedCount={completedCount}
          onToggleAll={onToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              onDelete={handleDelete}
              handleRename={handleRename}
              editingId={editingId}
              setEditingId={setEditingId}
              updateTodoItem={updateTodoItem}
            />

            <Footer
              uncompletedCount={uncompletedCount}
              completedCount={completedCount}
              handleClearCompleted={handleClearCompleted}
              setFilter={setFilter}
              filter={filter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
