import { useEffect, useState } from 'react';
import {
  addTodo, deleteTodo, getTodos, patchTodo,
} from './api/todos';
import { handleError } from './handleError';
import { ErrorMessage, Todo } from './types/Todo';

export const useTodos = (USER_ID: number) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [activeTodosId, setActiveTodosId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todo) => {
        setTodos(todo);
        setTitle('');
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noTodos);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!title.trim()) {
      handleError(setErrorMessage, ErrorMessage.noTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    setIsLoading(true);
    addTodo(newTodo).then((response) => {
      setTitle('');
      setTodos((oldTodos) => [...oldTodos, response]);
    }).catch(() => {
      handleError(setErrorMessage, ErrorMessage.noAddTodo);
    }).finally(() => {
      setIsLoading(false);
      setTempTodo(null);
    });
  };

  const handleDelete = (todoId: number) => {
    setActiveTodosId(prev => [...prev, todoId]);
    deleteTodo(todoId).then(() => {
      setTodos((oldTodos) => oldTodos.filter(todo => todo.id !== todoId));
    }).catch(() => {
      handleError(setErrorMessage, ErrorMessage.noDeleteTodo);
    }).finally(() => setActiveTodosId(activeTodosId
      .filter(id => todoId !== id)));
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const handleEdit = (
    editedTodo: Todo, editedTitle: string,
    e?: React.FormEvent<HTMLFormElement>,
  ) => {
    e?.preventDefault();
    const trimTitle = editedTitle.trim();
    const newTodo = { ...editedTodo, title: trimTitle };

    if (!trimTitle) {
      handleDelete(editedTodo.id);
      setEditTodo(null);

      return;
    }

    if (trimTitle !== editedTodo.title) {
      setActiveTodosId(prev => [...prev, editedTodo.id]);
      patchTodo(newTodo).then(() => {
        setTodos((oldTodos) => oldTodos
          .map(oldTodo => (oldTodo.id === newTodo.id ? newTodo : oldTodo)));
      }).catch(() => {
        handleError(setErrorMessage, ErrorMessage.noUpdateTodo);
      }).finally(() => setActiveTodosId(activeTodosId
        .filter(id => editedTodo.id !== id)));
    }

    setEditTodo(null);
  };

  const handleToggle = (todo: Todo) => {
    const newTodo: Todo = { ...todo, completed: !todo.completed };

    setActiveTodosId(prev => [...prev, todo.id]);
    patchTodo(newTodo).then(() => {
      setTodos((oldTodos) => oldTodos
        .map(oldTodo => (oldTodo.id === newTodo.id ? newTodo : oldTodo)));
    }).catch(() => {
      handleError(setErrorMessage, ErrorMessage.noUpdateTodo);
    }).finally(() => setActiveTodosId(activeTodosId
      .filter(id => todo.id !== id)));
  };

  const handleToggleButton = () => {
    const toggledTodos = todos.filter(todo => !todo.completed);

    if (toggledTodos.length) {
      toggledTodos.forEach(handleToggle);
    } else {
      todos.forEach(handleToggle);
    }
  };

  return {
    todos,
    errorMessage,
    isLoading,
    tempTodo,
    handleSubmit,
    handleDelete,
    handleToggle,
    handleToggleButton,
    title,
    setTitle,
    setErrorMessage,
    handleClearCompleted,
    handleEdit,
    editTodo,
    setEditTodo,
    activeTodosId,
  };
};
