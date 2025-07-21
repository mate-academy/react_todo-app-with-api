import React, { useEffect, useState, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import {
  getTodos,
  postTodo,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';
import { Todo } from './types';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [togglingTodoIds, setTogglingTodoIds] = useState<number[]>([]);
  const [renamingTodoIds, setRenamingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading && !isAdding) {
      inputRef.current?.focus();
    }
  }, [isLoading, isAdding]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setError('');
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodoTitle.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const newTodoData: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodoData);
    setError('');
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    try {
      const createdTodo = await postTodo(newTodoData);

      setTodos(current => [...current, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
      setNewTodoTitle(title);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoId(id);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      await deleteTodo(id);
      setTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setTogglingTodoIds(ids => [...ids, todo.id]);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      const response = await updateTodo(updatedTodo);

      setTodos(current =>
        current.map(t => (t.id === response.id ? response : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setTogglingTodoIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleRenameTodo = async (id: number, newTitle: string) => {
    const trimmed = newTitle.trim();

    if (!trimmed) {
      setDeletingTodoId(id);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 50));
      try {
        await deleteTodo(id);
        setTodos(current => current.filter(todo => todo.id !== id));

        return true;
      } catch {
        setError('Unable to delete a todo');

        return false;
      } finally {
        setDeletingTodoId(null);
      }
    }

    const todo = todos.find(t => t.id === id);

    if (!todo || todo.title === trimmed) {
      return false;
    }

    const updatedTodo = { ...todo, title: trimmed };

    setRenamingTodoIds(ids => [...ids, id]);
    await new Promise(resolve => setTimeout(resolve, 50));

    setError('');
    try {
      const response = await updateTodo(updatedTodo);

      setTodos(current => current.map(t => (t.id === id ? response : t)));

      return true;
    } catch {
      setError('Unable to update a todo');

      return false;
    } finally {
      setRenamingTodoIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleToggleAll = async () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const updatedTodos = todosToUpdate.map(todo => ({
      ...todo,
      completed: shouldCompleteAll,
    }));

    setError('');
    try {
      const responses = await Promise.all(
        updatedTodos.map(todo => updateTodo(todo)),
      );

      setTodos(current =>
        current.map(todo => {
          const updated = responses.find(r => r.id === todo.id);

          return updated ? updated : todo;
        }),
      );
    } catch {
      setError('Unable to toggle all todos');
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onSubmit={handleAddTodo}
          inputRef={inputRef}
          value={newTodoTitle}
          onChange={setNewTodoTitle}
          disabled={isLoading || isAdding}
          key={isAdding ? 'disabled' : 'enabled'}
        />

        <div
          data-cy="TodoLoader"
          className={`todo__loader-overlay ${isLoading ? 'is-active' : ''}`}
        >
          Loading...
        </div>

        {!isLoading && (
          <TodoList
            allTodos={todos}
            todos={filteredTodos}
            tempTodo={tempTodo}
            deletingTodoId={deletingTodoId}
            togglingTodoIds={togglingTodoIds}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            isLoading={isLoading}
            onToggleAll={handleToggleAll}
            renamingTodoIds={renamingTodoIds}
            onRename={handleRenameTodo}
          />
        )}

        {todos.length > 0 && !isLoading && (
          <Footer
            activeCount={todos.filter(t => !t.completed).length}
            completedCount={todos.filter(t => t.completed).length}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={() => {
              const completedIds = todos
                .filter(t => t.completed)
                .map(t => t.id);

              completedIds.forEach(id => handleDeleteTodo(id));
            }}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
