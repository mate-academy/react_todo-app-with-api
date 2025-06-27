import { FormEvent, useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo, updateTodo } from '../../api/todos';
import { TodoType } from '../../types/TodoType';
import { ErrorMessages } from '../../types/ErrorMessages';
import { FilterOptions } from '../../types/FilterOptions';

export const useTodo = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [tempTodo, setTempTodo] = useState<TodoType>();
  const [focusInput, setFocusInput] = useState(0);
  const [query, setQuery] = useState('');

  const filteredTodos = todos.filter(todo => {
    switch (filterOption) {
      case FilterOptions.Active:
        return !todo.completed;
      case FilterOptions.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const setError = (error: ErrorMessages) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessages.CantLoad))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCreateTodo = ({ title, completed, userId }: TodoType) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessages.TitleIsEmpty);

      return;
    }

    setTempTodo({ title: trimmedTitle, completed, userId, id: 0 });
    setIsLoading(true);

    postTodo({ title: trimmedTitle, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessages.UnableToAdd);
        setQuery(trimmedTitle);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    handleCreateTodo({
      title: query,
      id: 0,
      userId: 3085,
      completed: false,
    });
  };

  const handleDeleteTodo = (
    todoId: number,
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setUpdatingTodosIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorMessages.UnableToDelete);
        setIsEditing?.(true);
      })
      .finally(() => {
        setUpdatingTodosIds([]);

        if (!setIsEditing) {
          setFocusInput(prev => prev + 1);
        }
      });
  };

  const handleUpdateTodo = (todoId: number, data: unknown) => {
    setUpdatingTodosIds(prev => [...prev, todoId]);

    updateTodo(todoId, data)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo?.id === todoId) {
              const isCompleted = todo.completed;
              const newTodo = {
                ...todo,
                completed: !isCompleted,
              };
              return newTodo;
            } else {
              return todo;
            }
          }),
        );
      })
      .catch(() => {
        setError(ErrorMessages.UnableToUpdate);
      })
      .finally(() => {
        setUpdatingTodosIds([]);
      });
  };

  const handleUpdateTodos = () => {
    todos.map(todo => {
      if (todos.some(someTodo => !someTodo.completed) && todo.completed) {
        return todo;
      }

      setUpdatingTodosIds(prev => [...prev, todo.id]);

      return updateTodo(todo.id, {
        completed: todos.some(someTodo => !someTodo.completed),
      })
        .then(() => {
          setTodos(current =>
            current.map(currentTodo => {
              return {
                ...currentTodo,
                completed: todos.some(someTodo => !someTodo.completed),
              };
            }),
          );
        })
        .catch(() => {
          setError(ErrorMessages.UnableToUpdate);
        })
        .finally(() => {
          setUpdatingTodosIds([]);
        });
    });
  };

  const handleClearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(current =>
              current.filter(currentTodo => currentTodo.id !== todo.id),
            );
          })
          .catch(() => {
            setError(ErrorMessages.UnableToDelete);
          }),
      );
  };

  const handleTodoEditSubmit = (
    todo: TodoType,
    todoQuery: string,
    setTodoQuery?: React.Dispatch<React.SetStateAction<string>>,
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>,
    e?: FormEvent,
  ) => {
    e?.preventDefault();

    if (todo.title.trim() === todoQuery.trim()) {
      setIsEditing?.(false);
      setTodoQuery?.(todoQuery.trim());

      return;
    }

    if (!todoQuery) {
      handleDeleteTodo(todo.id, setIsEditing);

      return;
    }

    const forUpdate = { title: todoQuery.trim() };

    setUpdatingTodosIds(prev => [...prev, todo.id]);

    let hasError = false;

    updateTodo(todo?.id || 1, forUpdate)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo => {
            const newTodo = {
              ...currentTodo,
              title: todoQuery.trim(),
            };

            return todo?.id === currentTodo.id ? newTodo : currentTodo;
          }),
        );
      })
      .catch(() => {
        hasError = true;
        setErrorMessage(ErrorMessages.UnableToUpdate);
        setTodoQuery?.(todo.title.trim());
        setIsEditing?.(true);
      })
      .finally(() => {
        setUpdatingTodosIds([]);

        if (!hasError) {
          setIsEditing?.(false);
        }
      });
  };

  return {
    errorMessage,
    setErrorMessage,
    isLoading,
    todos,
    filteredTodos,
    filterOption,
    setFilterOption,
    handleCreateTodo,
    handleDeleteTodo,
    tempTodo,
    handleClearCompletedTodos,
    focusInput,
    setFocusInput,
    query,
    setQuery,
    handleSubmitForm,
    handleUpdateTodo,
    handleUpdateTodos,
    updatingTodosIds,
    handleTodoEditSubmit,
  };
};
