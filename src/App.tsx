/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorType';

export enum StatusFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );
  const [, setLoading] = useState(false);
  const [, setIsActionLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      setError(ErrorType.UNABLE_TO_LOAD_TODOS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTodos();
      inputRef.current?.focus();
    };

    init();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (statusFilter === 'all') {
      return true;
    }

    if (statusFilter === 'active') {
      return !todo.completed;
    }

    if (statusFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError(ErrorType.EMPTY_TITLE);
      {
        return;
      }
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsActionLoading(true);

    try {
      const created = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setError(ErrorType.UNABLE_TO_ADD_TODO);
    } finally {
      setTempTodo(null);
      setIsActionLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);
    setIsActionLoading(true);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorType.UNABLE_TO_DELETE_TODO);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));

      setIsActionLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        setDeletingTodoIds(prev => [...prev, todo.id]);
        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(t => t.id !== todo.id));
      } catch {
        setError(ErrorType.UNABLE_TO_DELETE_TODO);
      } finally {
        setDeletingTodoIds(prev => prev.filter(id => id !== todo.id));
      }
    }

    inputRef.current?.focus();
  };

  const handleToggleTodo = async (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    setError(null);
    setUpdatingTodoIds(prev => [...prev, todoId]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(ErrorType.UNABLE_TO_UPDATE_TODO);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todoId));
    }

    inputRef.current?.focus();
  };

  const handleToggleAll = async () => {
    const next = !todos.every(t => t.completed);
    const todosToUpdate = todos.filter(t => t.completed !== next);

    for (const todo of todosToUpdate) {
      setUpdatingTodoIds(prev => [...prev, todo.id]);

      try {
        const updated = await updateTodo(todo.id, { completed: next });

        setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      } catch {
        setError(ErrorType.UNABLE_TO_UPDATE_TODO);
      } finally {
        setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
      }
    }
  };

  const handleUpdateTodo = async (
    todoId: number,
    title: string,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setUpdatingTodoIds(prev => [...prev, todoId]);
    setError(null);

    try {
      const updated = await updateTodo(todoId, { title });

      setTodos(prev => prev.map(t => (t.id === todoId ? updated : t)));

      setEditing(false);
    } catch {
      setError(ErrorType.UNABLE_TO_UPDATE_TODO);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          disabled={!!tempTodo}
          hasTodos={todos.length > 0}
          allCompleted={todos.every(t => t.completed)}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todosCount={todos.filter(todo => !todo.completed).length}
            completedCount={todos.filter(todo => todo.completed).length}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}

        <ErrorNotification error={error} setError={setError} />
      </div>
    </div>
  );
};
