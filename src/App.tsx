import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  addTodo,
  getTodos,
  USER_ID,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import Header from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos } from './utils/getVisibleTodos';

export enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [filter, setFilter] = useState<SortType>(SortType.All);
  const [loading, setLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (msg: string) => {
    setError(msg);
    setIsErrorVisible(true);
    setTimeout(() => setIsErrorVisible(false), 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await getTodos();

        setTodos(data);
      } catch {
        showError(ErrorMessage.LoadTodos);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const closeError = () => {
    setIsErrorVisible(false);
    setError(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(filter, todos);

  // ------------------- Delete -------------------
  const handleDelete = async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      showError(ErrorMessage.DeleteTodo);
      throw err;
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // ------------------- Add -------------------
  const handleAdd = async (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTodos(prev => [...prev, tempTodo]);
    setLoading(true);

    try {
      const newTodo = await addTodo(trimmed);

      setTodos(prev => prev.map(todo => (todo.id === 0 ? newTodo : todo)));
      setNewTodoTitle('');
    } catch {
      setTodos(prev => prev.filter(todo => todo.id !== 0));
      showError(ErrorMessage.AddTodo);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Toggle -------------------
  const handleToggle = async (todo: Todo) => {
    setUpdatingTodoIds(prev => [...prev, todo.id]);

    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      showError(ErrorMessage.UpdateTodo);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  // ------------------- Update -------------------
  const handleUpdate = async (id: number, newTitle: string) => {
    setUpdatingTodoIds(prev => [...prev, id]);
    try {
      const updated = await updateTodo(id, { title: newTitle });

      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch {
      showError(ErrorMessage.UpdateTodo);
      throw new Error('Update failed');
    } finally {
      setUpdatingTodoIds(prev => prev.filter(tid => tid !== id));
    }
  };

  // ------------------- Clear Completed -------------------
  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const ids = completedTodos.map(todo => todo.id);

    // показать загрузчик на всех
    setDeletingTodoIds(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    setDeletingTodoIds(prev => prev.filter(id => !ids.includes(id)));

    setTodos(prev =>
      prev.filter(todo => {
        const res = results.find((_, i) => completedTodos[i].id === todo.id);

        return todo.completed ? res?.status !== 'fulfilled' : true;
      }),
    );

    if (results.some(r => r.status === 'rejected')) {
      showError(ErrorMessage.DeleteTodo);
    }

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // ------------------- Toggle All -------------------
  const toggleAll = async () => {
    if (todos.length === 0) {
      return;
    }

    const shouldComplete = !todos.every(todo => todo.completed);
    const toUpdate = todos.filter(todo => todo.completed !== shouldComplete);

    const ids = toUpdate.map(todo => todo.id);

    setUpdatingTodoIds(prev => [...prev, ...ids]);

    try {
      const updatedTodos = await Promise.all(
        toUpdate.map(todo =>
          updateTodo(todo.id, { completed: shouldComplete }),
        ),
      );

      setTodos(prev =>
        prev.map(todo => updatedTodos.find(u => u.id === todo.id) || todo),
      );
    } catch {
      showError(ErrorMessage.UpdateTodo);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => !ids.includes(id)));
    }
  };

  // ------------------- Render -------------------
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          loading={loading}
          onAdd={handleAdd}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputRef={inputRef}
          todos={todos}
          onToggleAll={toggleAll}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={handleDelete}
          onSelect={handleToggle}
          deletingTodoId={deletingTodoIds}
          updatingTodoId={updatingTodoIds}
          onUpdate={handleUpdate}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          isErrorVisible ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {error}
      </div>
    </div>
  );
};
