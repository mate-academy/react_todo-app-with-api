import { useEffect, useState } from 'react';
import {
  addTodo, deleteTodo, getTodos, patchTodo,
} from '../api/todos';
import { handleError } from '../components/ErrorBin/handleError';
import { ErrorMessageEnum, Todo } from '../types/Todo';

export const useTodos = (userId: number) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [refreshTodos, setRefreshTodos] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingArr, setIsLoadingArr] = useState<number[]>([0]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(userId)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessageEnum.noTodos);
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, [userId, refreshTodos]);

  const handleCompletedStatus = (chosenTodo: Todo) => {
    const updatedData = { ...chosenTodo, completed: !chosenTodo.completed };

    setIsLoadingArr((prev) => [...prev, chosenTodo.id]);
    patchTodo(chosenTodo.id, updatedData)
      .then(() => {
        setRefreshTodos(prev => !prev);
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessageEnum.noUpdateTodo);
      })
      .finally(() => {
        setIsLoadingArr(isLoadingArr
          .filter((todoId) => todoId !== chosenTodo.id));
      });
  };

  const handleToggleAll = () => {
    const toToggle = todos.filter((todo) => !todo.completed);

    if (!toToggle.length) {
      todos.forEach(handleCompletedStatus);
    } else {
      toToggle.forEach(handleCompletedStatus);
    }
  };

  const handleDelete = (chosenTodo: Todo) => {
    setIsLoadingArr((prev) => [...prev, chosenTodo.id]);

    deleteTodo(chosenTodo.id).then(() => {
      setRefreshTodos(prev => !prev);
    })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessageEnum.noDeleteTodo);
      })
      .finally(() => {
        setIsLoadingArr(isLoadingArr
          .filter((todoId) => todoId !== chosenTodo.id));
      });
  };

  const handleNewTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      handleError(setErrorMessage, ErrorMessageEnum.emptyTitle);

      return;
    }

    const trimmedTitle = newTodoTitle.trim();

    const newTodo = {
      userId,
      title: trimmedTitle,
      completed: false,
    };

    const tTodo = {
      id: 0,
      userId,
      title: trimmedTitle,
      completed: false,

    };

    setTempTodo(tTodo);

    addTodo(newTodo)
      .then(() => {
        setNewTodoTitle('');
        setRefreshTodos(prev => !prev);
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessageEnum.noPostTodo);
      })
      .finally(() => {
      });
  };

  const handleFormSubmitEdited
  = (
    chosenTodo: Todo,
    editTitle: string,
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    event?.preventDefault();
    const trimmedTitle = editTitle.trim();
    const updatedData = { title: trimmedTitle };

    setIsLoadingArr((prev) => [...prev, chosenTodo.id]);

    if (!trimmedTitle) {
      handleDelete(chosenTodo);
      setEditTodo(null);

      return;
    }

    if (trimmedTitle !== chosenTodo.title) {
      patchTodo(chosenTodo.id, updatedData)
        .then(() => {
          setRefreshTodos(prev => !prev);
          setEditTodo(null);
          setIsLoadingArr(isLoadingArr
            .filter((todoId) => todoId !== chosenTodo.id));
        })
        .catch(() => {
          handleError(setErrorMessage, ErrorMessageEnum.noUpdateTodo);
        })
        .finally(() => {
        });

      return;
    }

    setEditTodo(null);
    setIsLoadingArr(isLoadingArr
      .filter((todoId) => todoId !== chosenTodo.id));
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed)
      .forEach(todo => handleDelete(todo));
  };

  return {
    todos,
    tempTodo,
    handleToggleAll,
    handleNewTodoSubmit,
    handleFormSubmitEdited,
    handleClearCompleted,
    errorMessage,
    editTodo,
    setNewTodoTitle,
    newTodoTitle,
    handleCompletedStatus,
    handleDelete,
    isLoadingArr,
    setEditTodo,
    setErrorMessage,
  };
};
