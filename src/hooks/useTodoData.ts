import { useEffect, useState, useCallback } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/error';
import { todosService, USER_ID } from '../api/todos';

const useTodoData = (showError: (error: ErrorMessage) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      showError(ErrorMessage.Null);

      try {
        const todosFromServer = await todosService.getTodos();
        setTodos(todosFromServer);
      } catch {
        showError(ErrorMessage.LoadingTodos);
      }
    };

    loadTodos();
  }, []);

  const addToLoading = useCallback((todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
  }, []);

  const removeFromLoading = useCallback((todoId: number) => {
    setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
  }, []);

  const handleSubmit = useCallback(
    async (query: string, resetInput: () => void): Promise<void> => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        showError(ErrorMessage.EmptyTitle);
        return;
      }

      showError(ErrorMessage.Null);

      const temporaryTodo: Todo = {
        id: 0,
        title: normalizedQuery,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temporaryTodo);
      setLoadingTodoIds([temporaryTodo.id]);

      try {
        const newTodo = await todosService.createTodo({
          title: normalizedQuery,
        });

        setTodos(prev => [...prev, newTodo]);
        resetInput();
      } catch {
        showError(ErrorMessage.AddingTodo);
      } finally {
        setTempTodo(null);
        setLoadingTodoIds([]);
      }
    },
    [showError],
  );

  const handleDelete = useCallback(
    async (todoId: number) => {
      addToLoading(todoId);

      try {
        await todosService.deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        showError(ErrorMessage.DeletingTodo);
      } finally {
        removeFromLoading(todoId);
      }
    },
    [addToLoading, removeFromLoading, showError],
  );

  const handleEditTodo = useCallback(
    async (
      todoId: number,
      { fields }: { fields: Partial<Todo> },
    ): Promise<void> => {
      addToLoading(todoId);

      const foundTodo = todos.find(todo => todo.id === todoId);

      if (!foundTodo) {
        removeFromLoading(todoId);
        return;
      }

      const updatedTodo = {
        ...foundTodo,
        ...fields,
      };

      try {
        await todosService.editTodo({
          id: Number(todoId),
          title: updatedTodo.title,
          completed: updatedTodo.completed,
        });

        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId ? { ...todo, ...fields } : todo,
          ),
        );
      } catch {
        showError(ErrorMessage.UpdatingTodo);
        throw new Error('Failed to update todo');
      } finally {
        removeFromLoading(todoId);
      }
    },
    [todos, addToLoading, removeFromLoading, showError],
  );

  const handleToggleAllComplete = useCallback(async () => {
    if (todos.every(t => t.completed)) {
      const completedIds = todos.map(t => t.id);

      setLoadingTodoIds(completedIds);
      await Promise.all(
        completedIds.map(id =>
          handleEditTodo(id, { fields: { completed: false } }),
        ),
      );
      setLoadingTodoIds([]);
    } else if (todos.some(t => t.completed)) {
      const incompletedIds = todos.filter(t => !t.completed).map(t => t.id);

      setLoadingTodoIds(incompletedIds);
      await Promise.all(
        incompletedIds.map(id =>
          handleEditTodo(id, { fields: { completed: true } }),
        ),
      );
      setLoadingTodoIds([]);
    } else {
      const incompletedIds = todos.filter(t => !t.completed).map(t => t.id);

      setLoadingTodoIds(incompletedIds);
      await Promise.all(
        incompletedIds.map(id =>
          handleEditTodo(id, { fields: { completed: true } }),
        ),
      );
      setLoadingTodoIds([]);
    }
  }, [todos, handleEditTodo]);

  const handleDeleteAllCompleted = useCallback(async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setLoadingTodoIds(completedIds);
    await Promise.all(completedIds.map(id => handleDelete(id)));
    setLoadingTodoIds([]);
  }, [todos, handleDelete]);

  const getIsTodoLoading = useCallback(
    (todoId: number) => {
      return loadingTodoIds.includes(todoId);
    },
    [loadingTodoIds],
  );

  return {
    todos,
    tempTodo,
    loadingTodoIds,
    handleSubmit,
    handleDelete,
    handleEditTodo,
    handleToggleAllComplete,
    handleDeleteAllCompleted,
    getIsTodoLoading,
  };
};

export default useTodoData;
