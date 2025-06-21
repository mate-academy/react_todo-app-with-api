import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Todo, TodoError } from '../types/typedefs';
import {
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  USER_ID,
} from '../api/todosMethods';

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const ToDoServiceErrors = {
  Unknown: 'Something went wrong',
  UnableToLoad: 'Unable to load todos',
  Title: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
  UnableToDeleteTodo: 'Unable to delete a todo',
  UnableToUpdateTodo: 'Unable to update a todo',
} as const;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [loadingTodo, setLoadingTodo] = useState<number | 'initial' | null>(
    null,
  );
  const [title, setTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (error: TodoError) => {
    setErrorMessage(error);
  };

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    const loadTodos = () => {
      setLoadingTodo('initial');
      getTodos()
        .then(setTodos)
        .catch(() => {
          setErrorMessage(ToDoServiceErrors.UnableToLoad);
        })
        .finally(() => setLoadingTodo(null));
    };

    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, loadingTodo]);

  const isLoading = loadingTodo === 'initial';
  const tempTodo =
    loadingTodo === 0
      ? { id: 0, title: title.trim(), completed: false, userId: USER_ID }
      : null;
  const allCompleted = useMemo(
    () => todos.length > 0 && todos.every(td => td.completed),
    [todos],
  );
  const someCompleted = useMemo(() => todos.some(td => td.completed), [todos]);
  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const todosFiltered = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const toggleAll = useCallback(async () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newCompletedStatus }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const wasUpdated = todosToUpdate.some(
            updatedTodo => updatedTodo.id === todo.id,
          );

          return wasUpdated ? { ...todo, completed: newCompletedStatus } : todo;
        }),
      );
    } catch (err) {
      setErrorMessage(ToDoServiceErrors.UnableToUpdateTodo);
    }
  }, [todos, allCompleted]);

  const addTodo = useCallback(
    async (todoTitle: string) => {
      const noSpacetitle = todoTitle.trim();

      if (!noSpacetitle) {
        setErrorMessage(ToDoServiceErrors.Title);

        return false;
      }

      setLoadingTodo(0);

      try {
        const newTodo = await postTodo({
          title: noSpacetitle,
          completed: false,
          userId: USER_ID,
        });

        setTodos([...todos, newTodo]);

        return true;
      } catch {
        setErrorMessage(ToDoServiceErrors.UnableToAddTodo);

        return false;
      } finally {
        setLoadingTodo(null);
      }
    },
    [todos],
  );

  const toggleTodo = useCallback(
    async (todoId: number) => {
      const todo = todos.find(td => td.id === todoId);

      if (!todo) {
        return;
      }

      setLoadingTodo(todoId);

      try {
        await updateTodo(todoId, { completed: !todo.completed });

        setTodos(prevTodos =>
          prevTodos.map(td =>
            td.id === todoId ? { ...td, completed: !td.completed } : td,
          ),
        );
      } catch (err) {
        setErrorMessage(ToDoServiceErrors.UnableToUpdateTodo);
      } finally {
        setLoadingTodo(null);
      }
    },
    [todos],
  );

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodo(todoId);
      await deleteTodo(todoId);

      const todosAfterDelete = todos.filter(td => td.id !== todoId);

      setTodos(todosAfterDelete);
    } catch (err) {
      setErrorMessage(ToDoServiceErrors.UnableToDeleteTodo);
    } finally {
      setLoadingTodo(null);
    }
  };

  const clearCompleted = async () => {
    const todosDone = todos.filter(td => td.completed === true);

    if (todosDone.length === 0) {
      return;
    }

    const deleteResults = [];

    for (const todo of todosDone) {
      try {
        await deleteTodo(todo.id);
        deleteResults.push({ id: todo.id, success: true });
      } catch (err) {
        deleteResults.push({ id: todo.id, success: false });
        setErrorMessage(ToDoServiceErrors.UnableToDeleteTodo);
      }
    }

    const deletedTodos = deleteResults
      .filter(result => result.success)
      .map(result => result.id);

    const stayingTodos = todos.filter(todo => !deletedTodos.includes(todo.id));

    setTodos(stayingTodos);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      addTodo(title).then(success => {
        if (success) {
          setTitle('');
        }
      });
    },
    [addTodo, title],
  );

  const updateTodoTitle = async (todoId: number, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    const originalTodo = todos.find(t => t.id === todoId);

    if (!originalTodo) {
      return;
    }

    if (trimmedTitle === originalTodo.title) {
      return;
    }

    if (!trimmedTitle) {
      try {
        setLoadingTodo(todoId);
        await deleteTodo(todoId);

        const todosAfterDelete = todos.filter(td => td.id !== todoId);

        setTodos(todosAfterDelete);
      } catch (err) {
        setErrorMessage(ToDoServiceErrors.UnableToDeleteTodo);
        throw err;
      } finally {
        setLoadingTodo(null);
      }

      return;
    }

    try {
      setLoadingTodo(todoId);
      await updateTodo(todoId, { title: trimmedTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
        ),
      );
    } catch (err) {
      setErrorMessage(ToDoServiceErrors.UnableToUpdateTodo);
      throw err;
    } finally {
      setLoadingTodo(null);
    }
  };

  return {
    todos,
    errorMessage,
    isLoading,
    filterStatus,
    setFilterStatus,
    todosFiltered,
    tempTodo,
    loadingTodo,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    toggleAll,
    title,
    setTitle,
    inputRef,
    handleSubmit,
    allCompleted,
    someCompleted,
    activeCount,
    completedCount,
    updateTodoTitle,
    clearError,
    showError,
  };
};
