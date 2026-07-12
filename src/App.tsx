/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './components/UserWarning/UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoID] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessages.LoadTodos));
  }, []);

  useEffect(() => {
    if (error === null) {
      return;
    }

    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const isAllCompleted = todos.every(todo => todo.completed);

  let visibleTodos = todos;

  if (filter === 'completed') {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  if (filter === 'active') {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    createTodo(title.trim())
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setTitle('');
        setIsLoading(false);
        setTempTodo(null);
      })
      .catch(() => {
        setError(ErrorMessages.AddTodo);
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleStartEditing = (id: number, todoTitle: string) => {
    setEditingTodoID(id);
    setEditedTitle(todoTitle);
  };

  const handleCancelEditing = () => setEditingTodoID(null);

  const handleDelete = (id: number) => {
    setLoadingTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        inputRef.current?.focus();
        setLoadingTodoId(null);
      })
      .catch(() => {
        setError(ErrorMessages.DeleteTodo);
        setLoadingTodoId(null);
      });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const handleToggle = (id: number, data: Partial<Todo>) => {
    setLoadingTodoId(id);
    updateTodo(id, data)
      .then(serverTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];

          const index = newTodos.findIndex(
            currentTodo => currentTodo.id === serverTodo.id,
          );

          newTodos.splice(index, 1, serverTodo);

          return newTodos;
        });
        setLoadingTodoId(null);
      })
      .catch(() => {
        setError(ErrorMessages.UpdateTodo);
        setLoadingTodoId(null);
      });
  };

  const handleToggleAll = () => {
    const newCompleted = !isAllCompleted;

    todos.forEach(todo => {
      if (todo.completed !== newCompleted) {
        handleToggle(todo.id, {
          completed: newCompleted,
        });
      }
    });
  };

  const handleRenameTodo = (id: number, todoTitle: string) => {
    if (editedTitle.trim() === '') {
      handleDelete(id);

      return;
    }

    if (todoTitle === editedTitle.trim()) {
      setEditingTodoID(null);

      return;
    }

    setLoadingTodoId(id);

    updateTodo(id, { title: editedTitle.trim() })
      .then(serverTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];

          const index = newTodos.findIndex(
            currentTodo => currentTodo.id === serverTodo.id,
          );

          newTodos.splice(index, 1, serverTodo);

          return newTodos;
        });
        setLoadingTodoId(null);
        setEditingTodoID(null);
      })
      .catch(() => {
        setError(ErrorMessages.UpdateTodo);
        setLoadingTodoId(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
          hasTodos={todos.length > 0}
          isAllCompleted={isAllCompleted}
          handleToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            handleDelete={handleDelete}
            loadingTodoId={loadingTodoId}
            handleToggle={handleToggle}
            handleStartEditing={handleStartEditing}
            editingTodoId={editingTodoId}
            handleCancelEditing={handleCancelEditing}
            editedTitle={editedTitle}
            handleRenameTodo={handleRenameTodo}
            setEditedTitle={setEditedTitle}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            handleDelete={handleDelete}
            isLoading={isLoading}
            handleToggle={handleToggle}
            handleStartEditing={handleStartEditing}
            editingTodoId={editingTodoId}
            handleCancelEditing={handleCancelEditing}
            editedTitle={editedTitle}
            handleRenameTodo={handleRenameTodo}
            setEditedTitle={setEditedTitle}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
