/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect, useRef, useCallback } from 'react';
import * as postServise from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { FILTERS } from './constants/filters';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const addProcessingId = (id: number) => {
    setProcessingIds(ids => [...ids, id]);
  };

  const removeProcessingId = (id: number) => {
    setProcessingIds(ids => ids.filter(currentId => currentId !== id));
  };

  const handleRename = async (id: number, newTitle: string) => {
    addProcessingId(id);

    try {
      const updatedTodo = await postServise.updateTodo(id, {
        title: newTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
      );

      return true;
    } catch {
      setError(ErrorMessage.UpdateTodo);

      return false;
    } finally {
      removeProcessingId(id);
    }
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    setError(null);
    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await postServise.createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setError(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setIsAdding(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find(currentTodo => currentTodo.id === id);

    if (!todo) {
      return;
    }

    addProcessingId(id);

    try {
      const updatedTodo = await postServise.updateTodo(id, {
        completed: !todo.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      setError(ErrorMessage.UpdateTodo);
    } finally {
      removeProcessingId(id);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.All:
      default:
        return true;
    }
  });

  const loadTodos = useCallback(() => {
    setError(null);

    return postServise
      .getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  const handleDelete = async (id: number) => {
    addProcessingId(id);

    try {
      await postServise.deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));

      return true;
    } catch {
      setError(ErrorMessage.DeleteTodo);

      return false;
    } finally {
      removeProcessingId(id);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDelete(todo.id)));
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    loadTodos();
    inputRef.current?.focus();
  }, [loadTodos]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = async () => {
    const newCompletedStatus = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    await Promise.all(todosToUpdate.map(todo => handleToggle(todo.id)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onToggleAll={handleToggleAll}
          inputRef={inputRef}
          title={title}
          isAdding={isAdding}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          hasTodos={todos.length > 0}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onToggle={handleToggle}
            handleDelete={handleDelete}
            onRename={handleRename}
            processingIds={processingIds}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filters={FILTERS}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            activeTodosCount={activeTodosCount}
            hasCompleted={hasCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
