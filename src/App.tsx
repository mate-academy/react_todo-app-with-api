/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useLoading } from './hooks/useLoading';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, wrapWithLoading] = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [filterByStatus, setFilterByStatus] = useState<
    'all' | 'active' | 'completed'
  >('all');
  const [code, setCode] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    wrapWithLoading(async () => {
      setShowNotification(false);
      try {
        const fetchedTodos = await todoService.getTodos();
        setTodos(fetchedTodos);
      } catch {
        showErrorMessage('Unable to load todos');
      }
    });
  }, []);

  useEffect(() => {
    if (!isSubmitting && (error || code === '')) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, error, code]);

  const showErrorMessage = (message: string) => {
    setError(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
    if (error && showNotification) {
      setError(null);
      setShowNotification(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = code.trim();

    if (!trimmedTitle) {
      showErrorMessage('Title should not be empty');
      return;
    }

    setError(null);
    setShowNotification(false);
    setIsSubmitting(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await todoService.createTodo(trimmedTitle);
      setTodos(prev => [...prev, createdTodo]);
      setCode('');
    } catch {
      showErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  const updateTodo = async (todoId: number, title: string) => {
    setError(null);
    setShowNotification(false);
    setUpdatingTodos(prev => [...prev, todoId]);

    try {
      const updatedTodo = await todoService.updateTodo(todoId, {
        title: title.trim(),
      });
      setTodos(prev =>
        prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (err) {
      showErrorMessage('Unable to update a todo');
      throw err;
    } finally {
      setUpdatingTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  const deleteTodo = async (todoId: number) => {
    setError(null);
    setShowNotification(false);
    setDeletingTodos(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (err) {
      showErrorMessage('Unable to delete a todo');
      throw err;
    } finally {
      setDeletingTodos(prev => prev.filter(id => id !== todoId));
    }
  };
  const toggleTodo = async (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    setUpdatingTodos(prev => [...prev, todoId]);
    try {
      const updatedTodo = await todoService.updateTodo(todoId, {
        completed: !todo.completed,
      });
      setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  const toggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const shouldComplete = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setUpdatingTodos(todosToUpdate.map(t => t.id));
    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          todoService.updateTodo(todo.id, { completed: shouldComplete }),
        ),
      );
      setTodos(prev =>
        prev.map(todo => ({ ...todo, completed: shouldComplete })),
      );
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodos([]);
    }
  };

  const clearTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    setDeletingTodos(completedTodos.map(t => t.id));

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    );

    const successfullyDeletedIds: number[] = [];
    let hasErrors = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeletedIds.push(completedTodos[index].id);
      } else {
        hasErrors = true;
      }
    });

    if (successfullyDeletedIds.length > 0) {
      setTodos(prev => prev.filter(todo => !successfullyDeletedIds.includes(todo.id)));
    }

    if (hasErrors) {
      showErrorMessage('Unable to delete a todo');
    }

    setDeletingTodos([]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const filteredTodos = todos.filter(todo => {
    if (filterByStatus === 'active') return !todo.completed;
    if (filterByStatus === 'completed') return todo.completed;
    return true;
  });

  if (!todoService.USER_ID) return <UserWarning />;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          code={code}
          handleCodeChange={handleCodeChange}
          handleSubmit={handleSubmit}
          todos={todos}
          activeTodosCount={activeTodosCount}
          toggleAllTodos={toggleAllTodos}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          deletingTodos={deletingTodos}
          updatingTodos={updatingTodos}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            clearTodos={clearTodos}
            completedTodosCount={todos.length - activeTodosCount}
          />
        )}
      </div>

      {loading && <Loader />}

      <ErrorNotification
        message={error}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};
