/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Filter } from './api/types/Filters';
import { TempTodo } from './components/TempTodo';
import { updateTodo } from './api/todos';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { Todo } from './api/types/Todo';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(Filter.All);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    const promise = addTodo(newTodo);

    try {
      const createdTodo = await promise;

      setTodos(prev => [...prev, createdTodo]);
      setNewTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      inputRef.current?.focus();
    }
  };

  const loadTodos = useCallback(async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      showError('Unable to load todos');
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleToggle = async (id: number) => {
    const todo = todos.find(item => item.id === id);

    if (!todo) {
      return;
    }

    setLoadingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(item => (item.id === id ? updatedTodo : item)));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);

    const targetCompleted = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetCompleted,
    );

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, {
            completed: targetCompleted,
          }),
        ),
      );

      setTodos(current =>
        current.map(todo => {
          const updated = updatedTodos.find(item => item.id === todo.id);

          return updated || todo;
        }),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const handleRename = async (id: number, title: string) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, { title });

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));

      setEditingTodoId(null);
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingIds(prev => [...prev, id]);

      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(item => item !== id));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completed.map(todo => deleteTodo(todo.id)),
    );

    const successIds = completed
      .filter((_, i) => results[i].status === 'fulfilled')
      .map(todo => todo.id);

    const hasError = results.some(r => r.status === 'rejected');

    setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

    if (hasError) {
      showError('Unable to delete a todo');
    }

    inputRef.current?.focus();
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onSubmit={handleSubmit}
          isAdding={isAdding}
          inputRef={inputRef}
          hasTodos={todos.length > 0}
          allCompleted={todos.every(t => t.completed)}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={visibleTodos}
              deletingIds={deletingIds}
              loadingIds={loadingIds}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onRename={handleRename}
              onStartEditing={setEditingTodoId}
              onCancelEditing={() => setEditingTodoId(null)}
              editingTodoId={editingTodoId}
            />

            {tempTodo && <TempTodo todo={tempTodo} />}
          </section>
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
