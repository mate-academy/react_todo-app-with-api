/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Header } from './Header';
import { TodoItem } from './TodoItem';
import { Footer } from './Footer';
import { ErrorNotification } from './ErrorNotification';
import { updateTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(0);
  const [loadingTodoIds, setLoadingTodoIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const deleteOne = async (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
      setShouldFocusInput(prev => prev + 1);
    }
  };

  const handleEditStart = (id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleEditSave = async (id: number) => {
    if (!editTitle.trim()) {
      await deleteOne(id);

      return;
    }

    const changeTodos = todos.find(todoItem => todoItem.id === id);

    if (changeTodos && changeTodos.title === editTitle.trim()) {
      setEditingId(null);

      return;
    }

    setLoadingTodoIds(prev => new Set(prev).add(id));
    try {
      const updatedTodo = await updateTodo(id, { title: editTitle.trim() });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      setEditingId(null);
    } catch (updateError) {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prev => {
        const newSet = new Set(prev);

        newSet.delete(id);

        return newSet;
      });
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleToggleTodo = async (todoId: number) => {
    const currentTodo = todos.find(todoItem => todoItem.id === todoId);

    if (!currentTodo) {
      return;
    }

    const newCompletedStatus = !currentTodo.completed;

    setLoadingTodoIds(prev => new Set(prev).add(todoId));
    try {
      const updatedTodo = await updateTodo(todoId, {
        completed: newCompletedStatus,
      });

      setTodos(prev =>
        prev.map(todoItem => (todoItem.id === todoId ? updatedTodo : todoItem)),
      );
    } catch (updateError) {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prev => {
        const newSet = new Set(prev);

        newSet.delete(todoId);

        return newSet;
      });
    }
  };

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const todosFromServer = await client.get<Todo[]>(
        `/todos?userId=${USER_ID}`,
      );

      setTodos(todosFromServer);
    } catch {
      setError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async (title: string): Promise<boolean> => {
    setIsAdding(true);
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);
    try {
      const response = await client.post<Todo>('/todos', {
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, response]);

      return true;
    } catch {
      setError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleToggleAll = async () => {
    const hasActiveTodos = todos.some(todoItem => !todoItem.completed);
    const targetStatus = hasActiveTodos;
    const todosToUpdate = todos.filter(
      todoItem => todoItem.completed !== targetStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => {
      const newSet = new Set(prev);

      todosToUpdate.forEach(todoItem => newSet.add(todoItem.id));

      return newSet;
    });
    try {
      const promises = todosToUpdate.map(todoItem =>
        updateTodo(todoItem.id, { completed: targetStatus }),
      );
      const results = await Promise.allSettled(promises);

      results.forEach((promiseResult, index) => {
        const todoItem = todosToUpdate[index];

        if (promiseResult.status === 'fulfilled') {
          setTodos(prev =>
            prev.map(t => (t.id === todoItem.id ? promiseResult.value : t)),
          );
        } else {
          setError('Unable to update a todo');
        }
      });
    } catch (toggleError) {
      setError('Unable to update todos');
    } finally {
      setLoadingTodoIds(prev => {
        const newSet = new Set(prev);

        todosToUpdate.forEach(todoItem => newSet.delete(todoItem.id));

        return newSet;
      });
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingIds(completedTodos.map(todoItem => todoItem.id));

    const results = await Promise.allSettled(
      completedTodos.map(todoItem => client.delete(`/todos/${todoItem.id}`)),
    );

    const failed = results.some(r => r.status === 'rejected');
    const succeededIds = completedTodos
      .filter((_, i) => results[i].status === 'fulfilled')
      .map(todoItem => todoItem.id);

    setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));

    if (failed) {
      setError('Unable to delete a todo');
    }

    setDeletingIds([]);
    setShouldFocusInput(prev => prev + 1);
  };

  const hideError = () => setError(null);

  const getFilterTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todoItem => !todoItem.completed);
      case 'completed':
        return todos.filter(todoItem => todoItem.completed);
      default:
        return todos;
    }
  };

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeTodosCount;
  const shouldShowToggleAll = !loading && todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={addTodo}
          onToggleAll={handleToggleAll}
          disabled={isAdding}
          onError={setError}
          shouldFocusInput={shouldFocusInput}
          shouldToggleAll={shouldShowToggleAll}
        />
        {loading && <div className="loader" />}
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {getFilterTodos().map(todoItem => (
              <TodoItem
                key={todoItem.id}
                todo={todoItem}
                onToggle={handleToggleTodo}
                onDelete={deleteOne}
                isDeleting={deletingIds.includes(todoItem.id)}
                isLoading={loadingTodoIds.has(todoItem.id)}
                onEditSave={handleEditSave}
                onEditStart={handleEditStart}
                editingId={editingId}
                editTitle={editTitle}
                onEditTitleChange={setEditTitle}
                onEditCancel={handleEditCancel}
              />
            ))}
          </section>
        )}
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onToggle={() => {}}
            onDelete={() => {}}
            onEditStart={() => {}}
            onEditSave={() => {}}
            onEditCancel={() => {}}
            editingId={editingId}
            editTitle={editTitle}
            onEditTitleChange={setEditTitle}
            isDeleting={false}
            isLoading={false}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeCount={activeTodosCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>
      <ErrorNotification message={error} onClose={hideError} />
    </div>
  );
};
