// #region IMPORTS
import React, { useCallback, useEffect, useState } from 'react';
import { TodosContextType } from '../types/TodoContext';
import { Todo } from '../types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { ErrorType } from '../types/Error';
// #endregion

const USER_ID = 11121;

export const TodosContext = React.createContext<TodosContextType | null>(null);

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  // #region STATES
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [showLoaderFor, setShowLoaderFor] = useState<number[]>([]);
  // #endregion

  useEffect(() => {
    getTodos()
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError(ErrorType.fetchError);
      });
  }, []);

  const resetError = () => {
    setError('');
  };

  const handleSetError = (errorType: string) => {
    setError(errorType);
  };

  const addTodo = useCallback((title: string, id: number) => {
    setShowLoaderFor(prev => [...prev, id]);

    const newTempTodo: Todo = {
      id,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setDisabledInput(true);

    return createTodo(newTempTodo)
      .then((createdTodo) => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setError('');
      })
      .catch((serverError) => {
        setTempTodo(null);
        setError(ErrorType.addTodo);
        throw serverError;
      })
      .finally(() => {
        setDisabledInput(false);
        setShowLoaderFor(prev => prev.filter(todoId => todoId !== id));
      });
  }, [todos]);

  const removeTodo = useCallback((todoId: number) => {
    setShowLoaderFor(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(
          currentTodos => currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch((serverError) => {
        setError(ErrorType.deleteTodo);
        throw serverError;
      })
      .finally(() => {
        setShowLoaderFor(prev => prev.filter(id => id !== todoId));
      });
  }, [todos]);

  const updateTodoTitle = useCallback((id: number, newTitle: string) => {
    setShowLoaderFor(prev => [...prev, id]);
    const todoToRename = todos.find(todo => todo.id === id);

    if (!todoToRename) {
      return;
    }

    const updatedTodo = {
      ...todoToRename,
      title: newTitle,
    };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(
          (prevTodos) => prevTodos.map(
            (todo) => (todo.id === id ? updatedTodo : todo),
          ),
        );
      })
      .catch((serverError) => {
        setError(ErrorType.updateTodo);
        throw serverError;
      })
      .finally(() => {
        setShowLoaderFor(prev => prev.filter(todoId => id !== todoId));
      });
  }, [todos]);

  const toggleTodo = useCallback((id: number) => {
    const todoToToggle = todos.find(todo => todo.id === id);

    if (!todoToToggle) {
      return;
    }

    const updatedTodo = {
      ...todoToToggle,
      completed: !todoToToggle?.completed,
    };

    setShowLoaderFor(prev => [...prev, id]);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(
          (prevTodos) => prevTodos.map(
            (todo) => (todo.id === id ? updatedTodo : todo),
          ),
        );
      })
      .catch((serverError) => {
        setError(ErrorType.updateTodo);
        throw serverError;
      })
      .finally(() => {
        setShowLoaderFor(prev => prev.filter(togId => togId !== id));
      });
  }, [todos]);

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    completedTodoIds.forEach(removeTodo);
  };

  const toggleAllTodos = () => {
    const hasAllCompleted = todos.every(todo => todo.completed);

    todos
      .filter(todo => todo.completed === hasAllCompleted)
      .forEach(todo => toggleTodo(todo.id));
  };

  return (
    <TodosContext.Provider value={{
      todos,
      error,
      resetError,
      addTodo,
      removeTodo,
      handleSetError,
      disabledInput,
      tempTodo,
      toggleTodo,
      deleteCompletedTodos,
      updateTodoTitle,
      toggleAllTodos,
      showLoaderFor,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
