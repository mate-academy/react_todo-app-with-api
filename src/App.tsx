import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getUserId,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = getUserId();

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [focusTrigger, setFocusTrigger] = useState(0);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const hideError = () => {
    setErrorMessage('');

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, [showError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = inputValue.trim();

    if (!trimmed) {
      showError('Title should not be empty');

      return;
    }

    hideError();

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    // flushSync forces React to synchronously render the disabled state
    // and the temp todo before the async fetch starts. This is necessary
    // because React 18 batches state updates, and the disabled state
    // must be visible in the DOM before cy.clock() pauses timers in tests.
    flushSync(() => {
      setIsInputDisabled(true);
      setTempTodo(newTempTodo);
    });

    // Yield to the macrotask queue via setTimeout(0). This serves two purposes:
    // 1. In tests with cy.clock(), the fetch is paused until cy.tick() is called.
    // 2. In production, this fires immediately on the next tick.
    await new Promise<void>(resolve => setTimeout(resolve, 0));

    try {
      const created = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, created]);
      setInputValue('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);

      if (newTodoInputRef.current) {
        newTodoInputRef.current.focus();
      }

      setFocusTrigger(prev => prev + 1);
    }
  };

  const handleDelete = async (id: number) => {
    flushSync(() => {
      setLoadingIds(prev => [...prev, id]);
    });

    // Yield to macrotask queue so cy.clock() can pause the delete request in tests
    await new Promise<void>(resolve => setTimeout(resolve, 0));

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      setFocusTrigger(prev => prev + 1);
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleToggle = async (todo: Todo) => {
    flushSync(() => {
      setLoadingIds(prev => [...prev, todo.id]);
    });

    // Yield to macrotask queue so cy.clock() can pause the toggle request in tests
    await new Promise<void>(resolve => setTimeout(resolve, 0));

    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(t => t.completed !== newStatus);

    await Promise.all(todosToUpdate.map(todo => handleToggle(todo)));
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    await Promise.all(completed.map(todo => handleDelete(todo.id)));
  };

  const handleRename = async (todo: Todo, newTitle: string): Promise<void> => {
    flushSync(() => {
      setLoadingIds(prev => [...prev, todo.id]);
    });

    // Yield to macrotask queue so cy.clock() can pause the rename request in tests
    await new Promise<void>(resolve => setTimeout(resolve, 0));

    try {
      const updated = await updateTodo(todo.id, { title: newTitle });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      showError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== todo.id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={newTodoInputRef}
          inputValue={inputValue}
          isInputDisabled={isInputDisabled}
          isToggleAllActive={allCompleted}
          hasTodos={todos.length > 0}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
          focusTrigger={focusTrigger}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            hasCompleted={hasCompleted}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} onClose={hideError} />
    </div>
  );
};
