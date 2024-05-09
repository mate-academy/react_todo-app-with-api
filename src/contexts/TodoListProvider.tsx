import React from 'react';
import { useEffect, useState } from 'react';

import { TodoType } from '../types/TodoType';
import * as clientService from '../api/todos';
import { TodoListContext } from './TodoListContext';

import { Filters } from '../types/Filters';
import { Errors } from '../types/Errors';
import { TodoListProviderType } from '../types/TodoListProviderType';

export const TodoListProvider: React.FC<TodoListProviderType> = ({
  children,
}) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>(Filters.All);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    clientService
      .getTodos()
      .then((data: TodoType[]) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(Errors.LOAD);
      });
  }, []);

  const saveTempTodo = (todo: string) => {
    setTempTodo({
      id: 0,
      userId: clientService.USER_ID,
      title: todo,
      completed: false,
    });
  };

  const addTodo = async (todo: string) => {
    if (!todo.trim()) {
      setErrorMessage(Errors.EMPTY_TODO);

      return;
    }

    setIsDisabled(true);

    if (!errorMessage) {
      saveTempTodo(todo);
    }

    try {
      const data = await clientService.postTodo({
        title: todo,
        completed: false,
        userId: clientService.USER_ID,
      });

      setTodos([...todos, data]);
      setTempTodo(null);
      setIsDisabled(false);
    } catch {
      setErrorMessage(Errors.ADD_TODO);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await clientService.deleteTodo(id);

      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(Errors.DELETE_TODO);
    }
  };

  const clearCompletedTodo = async () => {
    const result = todos.filter(item => !item.completed);

    await Promise.all(
      todos.map(async todo => {
        setTodos(result);
        await clientService.deleteTodo(todo.id);
      }),
    ).catch(() => {
      setErrorMessage(Errors.DELETE_TODO);
    });
  };

  const updateTodo = async (id: number, todo: Partial<TodoType>) => {
    try {
      const data = await clientService.updateTodo(id, todo);

      const result = todos.map(item => {
        return item.id === id ? data : item;
      });

      setTodos(result);
    } catch {
      setErrorMessage(Errors.UPDATE_TODO);
    }
  };

  const updateIsCompletedTodo = async () => {
    const result = todos.map((data: TodoType) => {
      if (!data.completed || todos.every(item => item.completed)) {
        return { ...data, completed: !data.completed };
      }

      return data;
    });

    await Promise.all(
      todos.map(async data => {
        setTodos(result);
        await clientService.updateTodo(data.id, { completed: !data.completed });
      }),
    ).catch(() => {
      setErrorMessage(Errors.UPDATE_TODO);
    });
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const getValue = () => {
    return {
      todos,
      errorMessage,
      currentFilter,
      setCurrentFilter,
      addTodo,
      deleteTodo,
      clearErrorMessage,
      clearCompletedTodo,
      tempTodo,
      updateTodo,
      updateIsCompletedTodo,
      isDisabled,
    };
  };

  return (
    <TodoListContext.Provider value={getValue()}>
      {children}
    </TodoListContext.Provider>
  );
};
