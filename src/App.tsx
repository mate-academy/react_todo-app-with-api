/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { todosService } from './services/todosService';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ERROR_MESSAGES, getErrorMessage } from './utils/errorHandler';

import './styles/todoapp.scss';

/*eslint-disable-next-line max-len*/
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current!.focus();
    }
  }, []);

  useEffect(() => {
    let timer: number | null = null;

    const loadTodos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError(getErrorMessage(err, 'LOAD_TODOS'));

        timer = window.setTimeout(() => setError(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTodos();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filters = {
    all: (todos1: Todo[]) => todos1,
    active: (todos1: Todo[]) => todos1.filter(todo => !todo.completed),
    completed: (todos1: Todo[]) => todos1.filter(todo => todo.completed),
  };

  const getFilteredTodos = () => {
    return (filters[status] || filters.all)(todos);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setError(getErrorMessage(new Error(), 'EMPTY_TITLE'));
      setTimeout(() => setError(null), 3000);

      return;
    }

    const temp: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    const tempId = 0;
    const tempTodoWithFixedId: Todo = { ...temp, id: tempId };

    setProcessingIds(prev => [...prev, tempId]);
    setTempTodo(tempTodoWithFixedId);
    setIsCreatingTodo(true);

    try {
      const created = await todosService.addTodo(title);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch (err) {
      setError(getErrorMessage(err, 'ADD_TODO'));

      setTempTodo(null);
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== temp.id));
      setIsCreatingTodo(false);
      setTempTodo(null);
      setTimeout(() => {
        if (newTodoField.current) {
          newTodoField.current!.focus();
        }
      }, 0);
    }
  };

  const handleRemoveTodo = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    try {
      await todosService.removeTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'DELETE_TODO'));
      setTimeout(() => setError(null), 3000);
      throw err;
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));

      setTimeout(() => {
        if (newTodoField.current) {
          newTodoField.current!.focus();
        }
      }, 0);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const updated = await todosService.toggleTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(getErrorMessage(err, 'UPDATE_TODO'));
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== todo.id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    setProcessingIds(prev => [...prev, ...completedTodos.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(t => todosService.removeTodo(t.id)),
      );

      const successfulIds = completedTodos
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      if (successfulIds.length > 0) {
        setTodos(prev => prev.filter(t => !successfulIds.includes(t.id)));
      }

      if (results.some(r => r.status === 'rejected')) {
        setError(getErrorMessage(new Error(), 'DELETE_TODO'));
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !completedTodos.map(t => t.id).includes(id)),
      );

      setTimeout(() => {
        if (newTodoField.current) {
          newTodoField.current!.focus();
        }
      }, 0);
    }
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !areAllCompleted;
    const todosToToggle = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    if (todosToToggle.length === 0) {
      return;
    }

    const idsToProcess = todosToToggle.map(t => t.id);

    setProcessingIds(prev => [...prev, ...idsToProcess]);

    const updatePromises = todosToToggle.map(todo =>
      todosService.toggleTodo({ ...todo, completed: newCompletedStatus }),
    );

    try {
      const results = await Promise.allSettled(updatePromises);
      const updatedTodos: Todo[] = [];
      let hasError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          updatedTodos.push(result.value);
        } else {
          hasError = true;
        }
      });

      setTodos(prevTodos =>
        prevTodos.map(t => {
          const updated = updatedTodos.find(ut => ut.id === t.id);

          return updated || t;
        }),
      );

      if (hasError) {
        setError(getErrorMessage(new Error(), 'UPDATE_TODO'));
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'UPDATE_TODO'));
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => !idsToProcess.includes(id)));
    }
  };

  const handleRenameTodo = async (id: number, title: string) => {
    const todoToUpdate = todos.find(t => t.id === id);

    if (!todoToUpdate || title === todoToUpdate.title) {
      return;
    }

    setProcessingIds(prev => [...prev, id]);

    try {
      if (!title.trim()) {
        await handleRemoveTodo(id);

        return;
      }

      const updated = await todosService.updateTodo({
        ...todoToUpdate,
        title: title.trim(),
      });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err) {
      if (title.trim()) {
        setError(getErrorMessage(err, 'UPDATE_TODO'));
        setTimeout(() => setError(null), 3000);
      }

      throw new Error(ERROR_MESSAGES.UNKNOWN);
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  return (
    <div className="todoapp">
      <Header
        todos={todos}
        processingIds={processingIds}
        handleAddTodo={handleAddTodo}
        handleToggleAll={handleToggleAll}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newTodoField={newTodoField}
        isCreatingTodo={isCreatingTodo}
      />

      <TodoList
        todos={todos}
        processingIds={processingIds}
        getFilteredTodos={getFilteredTodos}
        handleToggleTodo={handleToggleTodo}
        handleRemoveTodo={handleRemoveTodo}
        tempTodo={tempTodo}
        isCreatingTodo={isCreatingTodo}
        isLoading={isLoading}
        handleRenameTodo={handleRenameTodo}
      />

      <Footer
        todos={todos}
        status={status}
        setStatus={setStatus}
        handleClearCompleted={handleClearCompleted}
      />

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
