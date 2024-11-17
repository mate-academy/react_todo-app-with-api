import { useState, useCallback, FormEvent, useRef } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, changeTodo, deleteTodos } from '../api/todos';
import { ErrorMessages } from '../enums/ErrorMessages';
import { USER_ID } from '../utils/USER_ID';
import { updateTodos } from '../utils/updateTodo';

export const useTodos = (
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages>>,
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodosCount, setLoadingTodosCount] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim().length) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      title: inputValue.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setLoadingTodosCount(currentCount => [...currentCount, 0]);

    addTodo(temporaryTodo)
      .then((createdTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.ADDING_ERROR);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodosCount(currentCount =>
          currentCount.filter(todoId => todoId !== 0),
        );
      });
  };

  const handleUpdateTodo = useCallback(
    (updatedTodo: Todo): Promise<void> => {
      setLoadingTodosCount(current => [...current, updatedTodo.id]);

      return changeTodo(updatedTodo.id, { title: updatedTodo.title })
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UPDATING_ERROR);
          throw new Error(ErrorMessages.UPDATING_ERROR);
        })
        .finally(() => {
          setLoadingTodosCount(current =>
            current.filter(id => id !== updatedTodo.id),
          );
        });
    },
    [setLoadingTodosCount, setTodos, setErrorMessage],
  );

  const handleTodosToggle = useCallback(() => {
    const hasIncompleteTodos = todos.some(todo => !todo.completed);
    const todosForToggling = todos
      .filter(todo => todo.completed !== hasIncompleteTodos)
      .map(todo => todo.id);

    updateTodos(
      todosForToggling,
      hasIncompleteTodos,
      setLoadingTodosCount,
      setTodos,
      setErrorMessage,
      changeTodo,
      deleteTodos,
    );
  }, [todos, setLoadingTodosCount, setTodos, setErrorMessage]);

  const handleTodoToggle = useCallback(
    (todoId: number, currentCompletedStatus: boolean) => {
      updateTodos(
        [todoId],
        !currentCompletedStatus,
        setLoadingTodosCount,
        setTodos,
        setErrorMessage,
        changeTodo,
        deleteTodos,
      );
    },
    [setLoadingTodosCount, setTodos, setErrorMessage],
  );

  const handleTodoDelete = useCallback(
    (todoId: number): Promise<void> => {
      setLoadingTodosCount(current => [...current, todoId]);

      return updateTodos(
        [todoId],
        null,
        setLoadingTodosCount,
        setTodos,
        setErrorMessage,
        changeTodo,
        deleteTodos,
      ).finally(() => {
        setLoadingTodosCount(current => current.filter(id => id !== todoId));
      });
    },
    [setLoadingTodosCount, setTodos, setErrorMessage],
  );

  const handleCompletedTodosDeleted = useCallback(() => {
    const todosForDeleting = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodosCount(current => [...current, ...todosForDeleting]);

    updateTodos(
      todosForDeleting,
      null,
      setLoadingTodosCount,
      setTodos,
      setErrorMessage,
      changeTodo,
      deleteTodos,
    ).finally(() => {
      setLoadingTodosCount(current =>
        current.filter(id => !todosForDeleting.includes(id)),
      );
    });
  }, [todos, setLoadingTodosCount, setTodos, setErrorMessage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return {
    todos,
    tempTodo,
    loadingTodosCount,
    inputRef,
    inputValue,
    setErrorMessage,
    handleSubmit,
    handleUpdateTodo,
    handleTodoDelete,
    setLoadingTodosCount,
    setTodos,
    setInputValue,
    handleTodosToggle,
    handleTodoToggle,
    handleCompletedTodosDeleted,
    handleInputChange,
  };
};
