/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { TodoItem } from './Components/TodoItem';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = (title: string, onSuccess: () => void) => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo(title)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTempTodo(null);
        onSuccess();
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number, onFail: () => void) => {
    setDeletingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        onFail();
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleToggleTodo = (todoId: number, completed: boolean) => {
    setUpdatingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    updateTodo(todoId, { completed })
      .then(updated => {
        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updated : todo)),
        );
        inputRef.current?.focus();
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setUpdatingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosExist = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const shouldComplete = !allCompleted;
    const todosToUpdate = todos.filter(t => t.completed !== shouldComplete);

    todosToUpdate.forEach(todo => handleToggleTodo(todo.id, shouldComplete));
  };

  const handleRenameTodo = (
    todoId: number,
    newTitle: string,
    onSuccess: () => void,
    onFail: () => void,
  ) => {
    const trimmed = newTitle.trim();

    if (!trimmed) {
      handleDeleteTodo(todoId);

      return;
    }

    const current = todos.find(t => t.id === todoId);

    if (!current || current.title === trimmed) {
      return;
    }

    setUpdatingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    updateTodo(todoId, { title: trimmed })
      .then(updated => {
        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updated : todo)),
        );
        inputRef.current?.focus();
        onSuccess();
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        onFail();
      })
      .finally(() => {
        setUpdatingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onAdd={handleAddTodo}
          isAdding={isAdding}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
          hasTodos={todos.length > 0}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            isLoading={isLoading}
            deletingIds={deletingIds}
            onDelete={handleDeleteTodo}
            updatingIds={updatingIds}
            onToggle={handleToggleTodo}
            onRename={handleRenameTodo}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading={true}
            onDelete={() => {}}
            onToggle={() => {}}
            onRename={() => {}}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={completedTodosExist}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
