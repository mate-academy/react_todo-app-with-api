/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './component/Header';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { ErrorNotification } from './component/Error';

export enum ErrorText {
  EmptyTitle = 'Title should not be empty',
  AddFailed = 'Unable to add a todo',
  UpdateFailed = 'Unable to update a todo',
  DeleteFailed = 'Unable to delete a todo',
  LoadFailed = 'Unable to load todos',
}

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export type FilterType = Filter.All | Filter.Active | Filter.Completed;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>(Filter.All);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const startLoading = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);
  };

  const stopLoading = (id: number) => {
    setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();

    if (!trimmed) {
      setError(ErrorText.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);
    setIsAdding(true);

    setError('');

    try {
      const newTodo = await todoService.postTodos({
        title: trimmed,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, newTodo]);
      setNewTitle('');
      inputRef.current?.focus();
    } catch {
      setError(ErrorText.AddFailed);
      inputRef.current?.focus();
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    if (!isAdding && tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [isAdding, tempTodo]);

  const toggleTodo = async (todo: Todo) => {
    startLoading(todo.id);
    setError('');

    try {
      await todoService.patchTodo(todo.id, { completed: !todo.completed });
      setTodos(prev =>
        prev.map(existingTodo =>
          existingTodo.id === todo.id
            ? { ...existingTodo, completed: !existingTodo.completed }
            : existingTodo,
        ),
      );
    } catch {
      setError(ErrorText.UpdateFailed);
    } finally {
      stopLoading(todo.id);
    }
  };

  const toggleAll = async () => {
    setError('');

    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = areAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    await Promise.all(
      todosToUpdate.map(async todo => {
        startLoading(todo.id);

        try {
          await todoService.patchTodo(todo.id, {
            completed: areAllCompleted ? false : true,
          });
          setTodos(prev =>
            prev.map(t =>
              t.id === todo.id
                ? { ...t, completed: areAllCompleted ? false : true }
                : t,
            ),
          );
        } catch {
          setError(ErrorText.UpdateFailed);
        } finally {
          stopLoading(todo.id);
        }
      }),
    );
  };

  const handleUpdateTodo = async (edited: Todo): Promise<boolean> => {
    startLoading(edited.id);
    setError('');

    try {
      const updatedTodo = await todoService.patchTodo(edited.id, {
        title: edited.title,
      });

      setTodos(prev =>
        prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );

      return true;
    } catch {
      setError(ErrorText.UpdateFailed);

      return false;
    } finally {
      stopLoading(edited.id);
    }
  };

  const clearCompleted = async () => {
    setError('');

    const completed = todos.filter(t => t.completed);

    await Promise.allSettled(
      completed.map(async todo => {
        startLoading(todo.id);

        try {
          await todoService.deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          setError(ErrorText.DeleteFailed);
        } finally {
          stopLoading(todo.id);
        }
      }),
    );
    inputRef.current?.focus();
  };

  const handleDeleteTodo = async (todoId: number) => {
    startLoading(todoId);
    setError('');
    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
      inputRef.current?.focus();

      return true;
    } catch {
      setError(ErrorText.DeleteFailed);

      return false;
    } finally {
      stopLoading(todoId);
    }
  };

  const filterTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    inputRef.current?.focus();
    setIsLoadingTodos(true);
    setError('');
    todoService
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        setError(ErrorText.LoadFailed);
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          toggleAll={toggleAll}
          isLoadingTodos={isLoadingTodos}
          newTitle={newTitle}
          isAdding={isAdding}
          inputRef={inputRef}
          onSubmit={handleAddTodo}
          onTitleChange={setNewTitle}
        />

        <TodoList
          todos={filterTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          onToggledTodo={toggleTodo}
          onDelete={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
        />

        <Footer
          todos={todos}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={clearCompleted}
        />
      </div>

    <ErrorNotification error={error} onErrorDeleat={() => setError('')} />
    </div>
  );
};
