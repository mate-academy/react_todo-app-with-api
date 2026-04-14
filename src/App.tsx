/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, updateTodo, USER_ID } from './api/todos'; // Додано updateTodo
import { Todo } from './types/Todo';
import { FILTERS, FilterType } from './constants/filters';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './constants/errors';

let internalIdCounter = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const errorTimer = useRef<NodeJS.Timeout | null>(null);
  const focusAfterOperation = useRef(false);

  const showError = (message: string) => {
    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }
    setErrorMessage(message);
    setIsErrorHidden(false);
    errorTimer.current = setTimeout(() => {
      setIsErrorHidden(true);
    }, 3000);
  };

  const hideError = () => {
    setIsErrorHidden(true);
  };

  const focusInput = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('.todoapp__new-todo');
    if (input) input.focus();
  }, []);


  const handleAddTodo = () => {
    const title = newTitle.trim();
    if (!title) {
      showError(ErrorMessage.EmptyTitle);
      return;
    }

    setIsAdding(true);
    const tempId = --internalIdCounter;
    const temp: Todo = { id: tempId, userId: USER_ID, title, completed: false };

    setTempTodo(temp);
    setLoadingIds(prev => [...prev, tempId]);

    addTodo({ userId: USER_ID, title, completed: false })
    .then(createdTodo => {
      setTodos(prev => [...prev, createdTodo]);
      setTempTodo(null);
      setNewTitle('');
    })
    .catch(() => {
      showError(ErrorMessage.Add);
      setTempTodo(null);
    })
    .finally(() => {
      setLoadingIds(prev => prev.filter(id => id !== tempId));
      setIsAdding(false);
      focusAfterOperation.current = true;
    });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
      .catch(() => showError(ErrorMessage.Delete))
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
        focusAfterOperation.current = true;
      });
  };

  const handleToggle = (id: number, completed: boolean) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    setLoadingIds(prev => [...prev, id]);
    updateTodo({ ...todoToUpdate, completed })
      .then(updatedTodo => {
        setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
      })
      .catch(() => showError(ErrorMessage.Update))
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleRename = (id: number, title: string) => {
    if (loadingIds.includes(id)) return;

    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate || todoToUpdate.title === title) return;

    setLoadingIds(prev => [...prev, id]);
    updateTodo({ ...todoToUpdate, title })
      .then(updatedTodo => {
        setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
      })
      .catch(() => showError(ErrorMessage.Update))
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    const idsToUpdate = todosToUpdate.map(t => t.id);
    setLoadingIds(prev => [...prev, ...idsToUpdate]);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({ ...todo, completed: !allCompleted })
            .then(updatedTodo => {
              setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
            })
        )
      );
    } catch {
      showError(ErrorMessage.Update);
    } finally {
      setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(t => t.id);

    setLoadingIds(prev => [...prev, ...idsToDelete]);

    try {
      await Promise.all(
        completedTodos.map(todo =>
          deleteTodo(todo.id).then(() => {
            setTodos(prev => prev.filter(t => t.id !== todo.id));
          })
        )
      );
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      focusAfterOperation.current = true;
    }
  };

  useEffect(() => {
  if (USER_ID) {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }
}, []);

  useEffect(() => {
    if (focusAfterOperation.current && !isAdding && loadingIds.length === 0) {
      focusInput();
      focusAfterOperation.current = false;
    }
  }, [todos, isAdding, loadingIds, focusInput]);


  const visibleTodos = (tempTodo ? [...todos, tempTodo] : todos).filter(todo => {
    if (filter === FILTERS.active) return !todo.completed;
    if (filter === FILTERS.completed) return todo.completed;
    return true;
  });

  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasTodos = todos.length > 0;
  const isAllCompleted = hasTodos && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {!USER_ID && <UserWarning />}
      {USER_ID && (
        <div className="todoapp__content">
          <Header
            title={newTitle}
            onTitleChange={setNewTitle}
            onSubmit={handleAddTodo}
            isDisabled={isAdding}
            onToggleAll={hasTodos ? handleToggleAll : undefined}
            isAllCompleted={isAllCompleted}
          />

          {hasTodos && (
            <>
              <TodoList
                todos={visibleTodos}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onRename={handleRename}
                loadingIds={loadingIds}
              />
              <Footer
                filter={filter}
                onFilterChange={setFilter}
                todosLeft={todosLeft}
                onClearCompleted={handleClearCompleted}
                hasCompletedTodos={todos.some(t => t.completed)}
              />
            </>
          )}
        </div>
      )}
      <ErrorNotification
        message={errorMessage}
        isHidden={isErrorHidden}
        onClose={hideError}
      />
    </div>
  );
};
