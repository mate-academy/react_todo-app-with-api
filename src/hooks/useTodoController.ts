import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/todo/Todo';
import * as todoService from '../api/todos';
import { ErrorMessages } from '../enums/errorMessages';
import { StatusFilter } from '../enums/statusFilter';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { AddTodoFormRef } from '../components/AddTodoForm';

export const useTodoController = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );
  const inputFocusRef = useRef<AddTodoFormRef>(null);

  useEffect(() => {
    setIsInitialLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.OnLoad);
      })
      .finally(() => setIsInitialLoading(false));
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, statusFilter);
  }, [todos, statusFilter]);

  const {
    isThereAlLeastOneTodo,
    isAllTodosCompleted,
    activeTodosCount,
    isThereAtLeastOneCompletedTodo,
  } = useMemo(() => {
    return {
      isThereAlLeastOneTodo: !!todos.length,
      isAllTodosCompleted: todos.every(todo => todo.completed),
      activeTodosCount: todos.filter(todo => !todo.completed).length,
      isThereAtLeastOneCompletedTodo: todos.some(todo => todo.completed),
    };
  }, [todos]);

  const addTodoIdToProcessing = useCallback((todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  }, []);

  const removeTodoFromProcessing = useCallback((todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  }, []);

  const updateTodoInState = useCallback((updatedTodo: Todo) => {
    setTodos(current =>
      current.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );
  }, []);

  const isTodoLoading = useCallback(
    (todoId: number) => {
      return tempTodo?.id === todoId || processingTodoIds?.includes(todoId);
    },
    [tempTodo, processingTodoIds],
  );

  const isAlLeastOneTodoLoading = useMemo(
    () => !!processingTodoIds.length,
    [processingTodoIds],
  );

  const onAddTodo = useCallback((todoTitle: string) => {
    if (todoTitle === '') {
      setErrorMessage(ErrorMessages.OnTitleEmpty);

      return Promise.reject(ErrorMessages.OnTitleEmpty);
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: todoService.USER_ID,
      title: todoTitle,
      completed: false,
    };

    const createTodoPromise: Promise<void> = todoService
      .createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnAdd);

        throw new Error(ErrorMessages.OnAdd);
      })
      .finally(() => {
        setTempTodo(null);
      });

    setTempTodo({
      ...newTodo,
      id: todoService.TEMP_TODO_ID,
    });

    return createTodoPromise;
  }, []);

  const onTodoDelete = useCallback(
    (todoId: Todo['id']) => {
      addTodoIdToProcessing(todoId);

      return todoService
        .deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.OnDelete);

          throw new Error(ErrorMessages.OnDelete);
        })
        .finally(() => {
          removeTodoFromProcessing(todoId);
          inputFocusRef.current?.focus();
        });
    },
    [addTodoIdToProcessing, removeTodoFromProcessing],
  );

  const onTodoUpdate = useCallback(
    (
      todoId: Todo['id'],
      todoDataToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
    ) => {
      addTodoIdToProcessing(todoId);

      return todoService
        .updateTodo(todoId, todoDataToUpdate)
        .then(updatedTodo => {
          updateTodoInState(updatedTodo);
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.onUpdate);

          throw new Error(ErrorMessages.onUpdate);
        })
        .finally(() => {
          removeTodoFromProcessing(todoId);
        });
    },
    [addTodoIdToProcessing, removeTodoFromProcessing, updateTodoInState],
  );

  const onClearCompletedTodos = useCallback(async () => {
    const allCompletedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await Promise.all(allCompletedTodoIds.map(id => onTodoDelete(id)));
  }, [onTodoDelete, todos]);

  const onToggleTodos = useCallback(async () => {
    const newStatus = !isAllTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    await Promise.all(
      todosToUpdate.map(todo =>
        onTodoUpdate(todo.id, { completed: newStatus }),
      ),
    );
  }, [isAllTodosCompleted, onTodoUpdate, todos]);

  return {
    todos,
    isThereAlLeastOneTodo,
    isInitialLoading,
    isAlLeastOneTodoLoading,
    isAllTodosCompleted,
    errorMessage,
    setErrorMessage,
    tempTodo,
    isTodoLoading,
    onAddTodo,
    inputFocusRef,
    onTodoDelete,
    onClearCompletedTodos,
    onTodoUpdate,
    onToggleTodos,
    statusFilter,
    setStatusFilter,
    filteredTodos,
    activeTodosCount,
    isThereAtLeastOneCompletedTodo,
  };
};
