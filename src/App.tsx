import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';

type FilterType = 'all' | 'active' | 'completed';

function getUserId(): number {
  try {
    const userData = localStorage.getItem('user');

    return userData ? JSON.parse(userData).id || 0 : 0;
  } catch {
    return 0;
  }
}

function getFilteredTodos(todos: Todo[], filter: FilterType): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

const TodoApp: React.FC<{ userId: number }> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const hideError = () => {
    setErrorMessage('');

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, [userId]);

  const addLoadingId = (id: number) => setLoadingIds(prev => [...prev, id]);

  const removeLoadingId = (id: number) =>
    setLoadingIds(prev => prev.filter(existingId => existingId !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hideError();

    const trimmed = newTodoTitle.trim();

    if (!trimmed) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setIsInputDisabled(true);

    const temp: Todo = {
      id: 0,
      userId,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const newTodo = await createTodo(userId, trimmed);

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number): Promise<void> => {
    addLoadingId(id);

    let success = false;

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      success = true;
    } catch {
      showError('Unable to delete a todo');
      throw new Error('Unable to delete a todo');
    } finally {
      removeLoadingId(id);

      if (success) {
        inputRef.current?.focus();
      }
    }
  };

  const handleUpdateTodo = async (
    id: number,
    data: Partial<Todo>,
  ): Promise<void> => {
    addLoadingId(id);

    try {
      const updated = await updateTodo(id, data);

      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch {
      showError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      removeLoadingId(id);
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const ids = todosToUpdate.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...ids]);

    let hasError = false;

    await Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: newStatus })
          .then(updated => {
            setTodos(prev =>
              prev.map(t => (t.id === updated.id ? updated : t)),
            );
          })
          .catch(() => {
            hasError = true;
          }),
      ),
    );

    if (hasError) {
      showError('Unable to update a todo');
    }

    setLoadingIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const ids = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...ids]);

    let hasError = false;

    await Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(prev => prev.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            hasError = true;
          }),
      ),
    );

    if (hasError) {
      showError('Unable to delete a todo');
    }

    setLoadingIds(prev => prev.filter(id => !ids.includes(id)));
    inputRef.current?.focus();
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const hasTodos = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          isInputDisabled={isInputDisabled}
          onTitleChange={setNewTodoTitle}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
          inputRef={inputRef}
        />

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {hasTodos && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} onClose={hideError} />
    </div>
  );
};

export const App: React.FC = () => {
  const userId = getUserId();

  if (!userId) {
    return <UserWarning />;
  }

  return <TodoApp userId={userId} />;
};
