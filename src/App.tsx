/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';

import { ErrorNotification } from './components/ErrorNotification';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoFieldRef = React.useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage(null);

      try {
        const data = await todoService.getTodos();

        setTodos(data);
      } catch {
        showError(ErrorMessage.Load);
      }
    };

    loadTodos();
    todoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      todoFieldRef.current?.focus();
    }
  }, [isLoading, todos.length]);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage(null);

    const trimmedTodoTitle = newTodoTitle.trim();

    if (!trimmedTodoTitle) {
      showError(ErrorMessage.Title);

      return;
    }

    setIsLoading(true);

    const newTempTodo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTodoTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await todoService.createTodo(trimmedTodoTitle);

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setErrorMessage(null);

    setLoadingIds(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onToggleTodo = async (todo: Todo) => {
    setErrorMessage(null);
    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await todoService.updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      showError(ErrorMessage.Update);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const onUpdateTodo = async (todoToUpdate: Todo, newTitle: string) => {
    setErrorMessage(null);
    setLoadingIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await todoService.updateTodo(todoToUpdate.id, {
        title: newTitle,
      });

      setTodos(prev =>
        prev.map(t => (t.id === todoToUpdate.id ? updatedTodo : t)),
      );
    } catch (error) {
      showError(ErrorMessage.Update);
      throw error;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  const onToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );

    todosToUpdate.forEach(todo => onToggleTodo(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={todoFieldRef}
          title={newTodoTitle}
          onTitleChange={setNewTodoTitle}
          onSubmit={handleFormSubmit}
          isToggleAllActive={
            todos.length > 0 && todos.every(todo => todo.completed)
          }
          isLoading={isLoading}
          onToggleAll={onToggleAll}
          hasTodos={!!todos.length}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              loadingIds={loadingIds}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              onToggleTodo={onToggleTodo}
              onUpdateTodo={onUpdateTodo}
            />
            <Footer
              activeTodosCount={activeTodosCount}
              filter={filter}
              setFilter={setFilter}
              hasCompleted={todos.some(todo => todo.completed)}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
