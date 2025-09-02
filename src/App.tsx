import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter, TodoFilter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draftTodo, setDraftTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState(TodoFilter.All);
  const [newTitle, setNewTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const filterTodos = useCallback((list: Todo[], type: string): Todo[] => {
    switch (type) {
      case TodoFilter.Active:
        return list.filter(todo => !todo.completed);
      case TodoFilter.Completed:
        return list.filter(todo => todo.completed);
      default:
        return list;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const list = await getTodos();

        setTodos(list);
      } catch {
        setError(ErrorMessage.Load);
      }
    })();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAdd = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newTitle.trim()) {
        setError(ErrorMessage.Empty);

        return;
      }

      const newTodo: Todo = {
        id: 0,
        title: newTitle.trim(),
        completed: false,
        userId: USER_ID,
      };

      setDraftTodo(newTodo);

      try {
        setInputDisabled(true);
        const saved = await addTodos(newTodo);

        setTodos(prev => [...prev, saved]);
        setNewTitle('');
      } catch {
        setTodos(prev => prev.filter(todo => todo.id !== 0));
        setError(ErrorMessage.Add);
      } finally {
        setInputDisabled(false);
        setDraftTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [newTitle],
  );

  const handleDelete = useCallback(async (id: number) => {
    setPendingIds(prev => [...prev, id]);
    try {
      await deleteTodos(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));

      return true;
    } catch {
      setError(ErrorMessage.Delete);

      return false;
    } finally {
      setPendingIds(prev => prev.filter(todoId => todoId !== id));
      inputRef.current?.focus();
    }
  }, []);

  const handleUpdate = useCallback(async (id: number, data: Partial<Todo>) => {
    setPendingIds(prev => [...prev, id]);
    try {
      const updated = await updateTodos(id, data);

      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));

      return true;
    } catch {
      setError(ErrorMessage.Update);

      return false;
    } finally {
      setPendingIds(prev => prev.filter(todoId => todoId !== id));
    }
  }, []);

  const handleClearCompleted = useCallback(async () => {
    const completed = todos.filter(t => t.completed);
    const ids = completed.map(t => t.id);

    if (!ids.length) {
      return;
    }

    setPendingIds(prev => [...prev, ...ids]);
    try {
      const results = await Promise.allSettled(
        completed.map(t => deleteTodos(t.id)),
      );

      const successful = completed
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      if (successful.length > 0) {
        setTodos(prev => prev.filter(t => !successful.includes(t.id)));
      }

      if (results.some(r => r.status === 'rejected')) {
        setError(ErrorMessage.Delete);
      }
    } catch {
      setError(ErrorMessage.Delete);
    } finally {
      setPendingIds(prev => prev.filter(id => !ids.includes(id)));
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [todos]);

  const allCompleted = useMemo(
    () => todos.length > 0 && todos.every(t => t.completed),
    [todos],
  );

  const handleToggleAll = useCallback(async () => {
    const target = !allCompleted;
    const toUpdate = todos.filter(t => t.completed !== target);

    if (!toUpdate.length) {
      return;
    }

    const ids = toUpdate.map(t => t.id);

    setPendingIds(prev => [...prev, ...ids]);

    try {
      await Promise.all(
        toUpdate.map(t => updateTodos(t.id, { completed: target })),
      );
      setTodos(prev => prev.map(t => ({ ...t, completed: target })));
    } catch {
      setError(ErrorMessage.Update);
    } finally {
      setPendingIds(prev => prev.filter(id => !ids.includes(id)));
    }
  }, [allCompleted, todos]);

  const handleEdit = useCallback((id: number) => {
    setEditId(id);
  }, []);

  const handleSave = useCallback(
    async (id: number, newValue: string, oldValue: string) => {
      const trimmed = newValue.trim();

      if (!trimmed) {
        const removed = await handleDelete(id);

        if (!removed) {
          return;
        }
      } else if (trimmed !== oldValue) {
        const ok = await handleUpdate(id, { title: trimmed });

        if (!ok) {
          return;
        }
      }

      setEditId(null);
    },
    [handleDelete, handleUpdate],
  );

  const handleFormSave = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, id: number, old: string) => {
      e.preventDefault();
      const input = e.currentTarget.elements[0] as HTMLInputElement;

      await handleSave(id, input.value, old);
    },
    [handleSave],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setEditId(null);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    [],
  );

  const renderTodos = useMemo(
    () => (draftTodo ? [...todos, draftTodo] : todos),
    [todos, draftTodo],
  );

  const filtered = useMemo(
    () => filterTodos(renderTodos, status),
    [filterTodos, renderTodos, status],
  );

  const activeItems = useMemo(() => todos.filter(t => !t.completed), [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todosLength={todos.length}
          allCompleted={allCompleted}
          newTitle={newTitle}
          inputRef={inputRef}
          inputDisabled={inputDisabled}
          onToggleAll={handleToggleAll}
          onChangeTitle={setNewTitle}
          onAdd={handleAdd}
        />

        <TodoList
          todos={filtered}
          editId={editId}
          pendingIds={pendingIds}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSave={handleSave}
          onFormSave={handleFormSave}
          onKeyDown={handleKeyDown}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            activeItems={activeItems}
            status={status}
            onChangeStatus={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onHide={() => setError('')} />
    </div>
  );
};
