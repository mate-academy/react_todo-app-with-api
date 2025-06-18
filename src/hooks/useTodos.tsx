import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { StatusFilterOptions } from '../types/StatusFilterOptions';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(StatusFilterOptions.all);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todoInOperation, setTodoInOperation] = useState<number[]>([]);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const inputFocus = useRef<HTMLInputElement>(null);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const hasTodos = useMemo(() => todos.length > 0, [todos]);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, { status: statusFilter }),
    [todos, statusFilter],
  );

  const activeTodos = useMemo(
    () => todos.length - completedTodos.length,
    [todos, completedTodos],
  );

  const allTodosCompleted = useMemo(
    () => todos.length > 0 && completedTodos.length === todos.length,
    [todos, completedTodos],
  );

  const isCompletedTodos = useMemo(
    () => completedTodos.length > 0,
    [completedTodos],
  );

  useEffect(() => {
    setIsLoading(true);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(todosService.TodosError.unableToLoad))
      .finally(() => setIsLoading(false));
  }, []);

  const handleTodoDelete = (todoId: number) => {
    setTodoInOperation(current => [...current, todoId]);

    if (inputFocus.current) {
      inputFocus.current.disabled = true;
    }

    todosService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage(todosService.TodosError.unableToDelete))
      .finally(() => {
        setTodoInOperation(current => current.filter(id => id !== todoId));

        if (inputFocus.current) {
          inputFocus.current.disabled = false;
          inputFocus.current.focus();
        }
      });
  };

  const handleDeleteAllCompletedTodos = () => {
    if (inputFocus.current) {
      inputFocus.current.disabled = true;
    }

    Promise.allSettled(completedTodos.map(todo => handleTodoDelete(todo.id)));
  };

  const handleTodoAdd = (title: string) => {
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todosService.USER_ID,
    });

    return todosService
      .addTodos({ userId: todosService.USER_ID, title, completed: false })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
        setTempTodo(null);
      });
  };

  const handleUseToggle = () => {
    const newStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setTodoInOperation(current => [...current, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo => {
      const updatedTodo = { ...todo, completed: newStatus };

      return todosService
        .updateTodos(updatedTodo)
        .then(updated => {
          setTodos(currentTodos =>
            currentTodos.map(t => (t.id === updated.id ? updated : t)),
          );
        })
        .catch(() => {
          setErrorMessage(todosService.TodosError.unableToUpdate);
        });
    });

    Promise.allSettled(updatePromises).finally(() => {
      setTodoInOperation(current =>
        current.filter(id => !idsToUpdate.includes(id)),
      );
    });
  };

  const handleTodoStatusToggle = (todoToUpdate: Todo) => {
    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    setTodoInOperation(current => [...current, todoToUpdate.id]);

    todosService
      .updateTodos(updatedTodo)
      .then(updated => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === updated.id ? updated : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(todosService.TodosError.unableToUpdate);
      })
      .finally(() => {
        setTodoInOperation(current =>
          current.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const handleTodoTitleUpdate = (todoToUpdate: Todo, newTitle: string) => {
    const updatedTodo = {
      ...todoToUpdate,
      title: newTitle,
    };

    setTodoInOperation(current => [...current, todoToUpdate.id]);

    return todosService
      .updateTodos(updatedTodo)
      .then(updated => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === updated.id ? updated : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(todosService.TodosError.unableToUpdate);
        throw new Error('Unable to update');
      })
      .finally(() => {
        setTodoInOperation(current =>
          current.filter(id => id !== updatedTodo.id),
        );
      });
  };

  return {
    errorMessage,
    setErrorMessage,
    statusFilter,
    setStatusFilter,
    handleHideError,
    hasTodos,
    filteredTodos,
    activeTodos,
    allTodosCompleted,
    isCompletedTodos,
    handleTodoDelete,
    handleDeleteAllCompletedTodos,
    handleTodoAdd,
    tempTodo,
    setTempTodo,
    inputFocus,
    todoInOperation,
    handleUseToggle,
    handleTodoStatusToggle,
    handleTodoTitleUpdate,
    isLoading,
  };
};
