import { useState, useEffect, useRef, useCallback } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todos';
import { ERROR_MESSAGES } from '../constants/errors';

export function useTodos(userId: number) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [notification, setNotification] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /** Load todos on mount */
  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const list = await getTodos();

        setTodos(list);
      } catch {
        setNotification(ERROR_MESSAGES.LOAD);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  /** Add new todo */
  const handleAddTodo = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newTitle.trim();

      if (!trimmed) {
        setNotification(ERROR_MESSAGES.EMPTY_TITLE);
        focusInput();

        return;
      }

      const optimistic: Todo = {
        id: 0,
        title: trimmed,
        completed: false,
        userId,
      };

      setTempTodo(optimistic);
      setIsSubmitting(true);

      try {
        const created = await addTodo({
          title: trimmed,
          completed: false,
          userId,
        });

        setTodos(prev => [...prev, created]);
        setNewTitle('');
      } catch {
        setNotification(ERROR_MESSAGES.ADD);
      } finally {
        setTempTodo(null);
        setIsSubmitting(false);
      }
    },
    [newTitle, userId, focusInput],
  );

  /** Update todo */
  const handleUpdateTodo = useCallback(
    async (id: number, data: Partial<Todo>) => {
      setProcessingIds(ids => [...ids, id]);
      try {
        const updated = await updateTodo({ id, ...data });

        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } catch {
        setNotification(ERROR_MESSAGES.UPDATE);
        throw new Error(ERROR_MESSAGES.UPDATE);
      } finally {
        setProcessingIds(ids => ids.filter(x => x !== id));
      }
    },
    [],
  );

  /** Delete todo */
  const handleDeleteTodo = useCallback(
    async (id: number) => {
      setProcessingIds(ids => [...ids, id]);
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
        // if we were editing this todo, cancel editing
        if (editingId === id) {
          setEditingId(null);
          setEditingTitle('');
        }
      } catch {
        setNotification(ERROR_MESSAGES.DELETE);
        throw new Error(ERROR_MESSAGES.DELETE);
      } finally {
        setProcessingIds(ids => ids.filter(x => x !== id));
      }
    },
    [editingId],
  );

  const handleClearCompleted = useCallback(async () => {
    const completed = todos.filter(t => t.completed);

    setProcessingIds(ids => [...ids, ...completed.map(t => t.id)]);

    const results = await Promise.allSettled(
      completed.map(async t => {
        try {
          await deleteTodo(t.id);
          setTodos(prev => prev.filter(x => x.id !== t.id));
        } catch {
          setNotification(ERROR_MESSAGES.DELETE);
          throw new Error(ERROR_MESSAGES.DELETE);
        } finally {
          setProcessingIds(ids => ids.filter(x => x !== t.id));
        }
      }),
    );

    if (results.some(r => r.status === 'rejected')) {
      setNotification(ERROR_MESSAGES.DELETE);
    }
  }, [todos]);

  /** Toggle all todos */
  const handleToggleAll = useCallback(async () => {
    const shouldCompleteAll = !todos.every(t => t.completed);

    const todosToUpdate = todos.filter(t => t.completed !== shouldCompleteAll);

    setProcessingIds(ids => [...ids, ...todosToUpdate.map(t => t.id)]);

    const results = await Promise.allSettled(
      todosToUpdate.map(async t => {
        try {
          const updated = await updateTodo({
            id: t.id,
            completed: shouldCompleteAll,
          });

          setTodos(prev => prev.map(x => (x.id === updated.id ? updated : x)));
        } catch {
          setNotification(ERROR_MESSAGES.UPDATE);
          throw new Error(ERROR_MESSAGES.UPDATE);
        } finally {
          setProcessingIds(ids => ids.filter(x => x !== t.id));
        }
      }),
    );

    if (results.some(r => r.status === 'rejected')) {
      setNotification(ERROR_MESSAGES.UPDATE);
    }
  }, [todos]);

  /** Editing logic */

  const startEditing = useCallback((id: number, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  }, []);

  const changeEditingTitle = useCallback((value: string) => {
    setEditingTitle(value);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditingTitle('');
  }, []);

  const submitEditing = useCallback(async () => {
    if (editingId === null) {
      return;
    }

    const todo = todos.find(t => t.id === editingId);

    if (!todo) {
      return;
    }

    const trimmed = editingTitle.trim();

    // unchanged → do nothing, keep input open
    if (trimmed === todo.title) {
      cancelEditing();

      return;
    }

    // empty → delete
    if (!trimmed) {
      try {
        setProcessingIds(ids => [...ids, editingId]);
        await handleDeleteTodo(editingId);
        cancelEditing(); // only close on succsses
      } catch {
        // deletion error already set → keep input open
      } finally {
        setProcessingIds(ids => ids.filter(x => x !== editingId));
      }

      return;
    }

    // update
    try {
      setProcessingIds(ids => [...ids, editingId]);
      await handleUpdateTodo(editingId, { title: trimmed });
      cancelEditing(); // only close on success
    } catch {
      setNotification(ERROR_MESSAGES.UPDATE);
      // keep input open on failure
    } finally {
      setProcessingIds(ids => ids.filter(x => x !== editingId));
    }
  }, [
    editingId,
    editingTitle,
    todos,
    handleDeleteTodo,
    handleUpdateTodo,
    cancelEditing,
  ]);

  return {
    todos,
    tempTodo,
    newTitle,
    setNewTitle,
    isSubmitting,
    notification,
    loading,
    processingIds,
    inputRef,

    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,

    editingId,
    editingTitle,
    changeEditingTitle,
    startEditing,
    cancelEditing,
    submitEditing,
  };
}
