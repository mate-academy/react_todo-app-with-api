import { useEffect, useState } from 'react';
import {
  getTodos,
  deleteTodo,
  USER_ID,
  addTodo,
  updateTodo,
} from '../api/todos';
import { ErrorMessages } from '../components/contants';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import {
  getActiveTodosCount,
  getAllCompleted,
  getFilteredTodos,
} from '../utils/todoUtils';
import { useFocus } from './useFocus';

export const useTodosManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const { inputRef, setShouldFocus } = useFocus();

  const todosCounter = getActiveTodosCount(todos);
  const preparedTodos = getFilteredTodos(todos, filter);
  const isDisabled = !todos.some(todo => todo.completed);
  const allCompleted = getAllCompleted(todos);

  const activeError = (message: string) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.LOAD_TODOS))
      .finally(() => setLoading(false));
  }, []);

  const handlToggleTodo = (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setLoadingId(prev => [...prev, todoId]);

    updateTodo({ ...todoToUpdate, completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UPDATE_TODO);
      })
      .finally(() => {
        setLoadingId(prev => prev.filter(id => id !== todoId));
        setShouldFocus(true);
        setTempTodo(null);
      });
  };

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);
      setShouldFocus(true);

      return;
    }

    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoading(true);

    addTodo(newTempTodo)
      .then(addedTodo => {
        setTodos(prev => [...prev, addedTodo]);
        setTempTodo(null);

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      })
      .catch(() => {
        activeError(ErrorMessages.ADD_TODO);
        setLoading(false);
      })
      .finally(() => {
        setShouldFocus(true);
        setTempTodo(null);
        setLoading(false);
      });
  };

  // This function is not implemented yet, but it should toggle the completion status of all todos
  const handlToggleAll = () => {
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoading(true);

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: newStatus })
          .then(updatedTodo => {
            setTodos(prev =>
              prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessages.UPDATE_TODO);
          })
          .finally(() => {
            setLoadingId(prev => prev.filter(id => id !== todo.id));
            setShouldFocus(true);
          }),
      ),
    );
  };

  const handlDeleteTodo = (todoId: number) => {
    setLoadingId(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(ErrorMessages.DELETE_TODO))
      .finally(() => {
        setLoadingId(prev => prev.filter(id => id !== todoId));
        setShouldFocus(true);
      });
  };

  const handleUpdateTodo = async (todoToUpdate: Todo): Promise<boolean> => {
    setLoadingId(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );

      return true;
    } catch (error) {
      setErrorMessage(ErrorMessages.UPDATE_TODO);

      return false;
    } finally {
      setLoadingId(prev => prev.filter(todoId => todoId !== todoToUpdate.id));
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handlDeleteTodo(todo.id);
      }
    });
  };

  return {
    todos,
    loading,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    todosCounter,
    preparedTodos,
    handlDeleteTodo,
    handleClearCompleted,
    handleAddTodo,
    tempTodo,
    inputRef,
    setShouldFocus,
    loadingId,
    setLoadingId,
    activeError,
    isDisabled,
    allCompleted,
    handlToggleTodo,
    handlToggleAll,
    handleUpdateTodo,
  };
};
