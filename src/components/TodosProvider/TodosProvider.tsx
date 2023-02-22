import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorTypes } from '../../types/ErrorTypes';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  updateTodoCompletion,
} from '../../api/todos';
import { RequestTodo } from '../../types/RequestTodo';
import { RequestCompletion } from '../../types/RequestCompletion';
import { RequestUpdateTodo } from '../../types/RequestUpdateTodo';

const USER_ID = 6325;

const temporaryTodo: Todo = {
  id: 0,
  userId: USER_ID,
  title: '',
  completed: false,
};

type ContextType = {
  errorType: ErrorTypes,
  tempTodo: Todo | null,
  todos: Todo[],
  processedTodos: Todo[],
  handleFormSubmit: (value: string) => void,
  handleDeleteTodo: (todoId: number) => void,
  handleStatus: (todo: Todo) => void,
  handleStatusAll: (todos: Todo[]) => void,
  clearAll: (todos: Todo[]) => void,
  handleUpdate: (todo: Todo, title: string) => void,
  errorTypeHandler: (error: ErrorTypes) => void,
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  tempTodo: temporaryTodo,
  errorType: ErrorTypes.NONE,
  processedTodos: [],
  handleFormSubmit: () => {},
  handleDeleteTodo: () => {},
  handleStatus: () => {},
  handleStatusAll: () => {},
  clearAll: () => {},
  handleUpdate: () => {},
  errorTypeHandler: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorType(ErrorTypes.UPLOAD_ERROR);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const handleFormSubmit = async (query: string) => {
    if (query.trim() === '') {
      setErrorType(ErrorTypes.EMPTY_TITLE);
    } else {
      const newTodo: RequestTodo = {
        userId: USER_ID,
        title: query,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        await addTodo(USER_ID, newTodo);
        await getTodosFromServer();
        setTempTodo(null);
      } catch (error) {
        setErrorType(ErrorTypes.ADD_ERROR);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!todoId) {
      return;
    }

    try {
      const deletionResponse = await deleteTodo(todoId);

      if (await deletionResponse === 1) {
        await getTodosFromServer();
      }
    } catch (error) {
      setErrorType(ErrorTypes.DELETE_ERROR);
    }
  };

  const clearAll = async (todosToDelete: Todo[]) => {
    setProcessedTodos(todosToDelete);
    try {
      const deletionPromises = todosToDelete.map(todo => {
        return deleteTodo(todo.id);
      });

      const response = await Promise.all(deletionPromises);

      if (response.every(res => res === 1)) {
        await getTodosFromServer();
        setProcessedTodos([]);
      }
    } catch (error) {
      setErrorType(ErrorTypes.DELETE_ERROR);
    }
  };

  const handleStatus = async (todo: Todo) => {
    setProcessedTodos([todo]);
    const completion: RequestCompletion = {
      completed: !todo.completed,
    };

    try {
      await updateTodoCompletion(todo.id, completion);
      await getTodosFromServer();
      setProcessedTodos([]);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE_ERROR);
    }
  };

  const handleStatusAll = async (todosToComplete: Todo[]) => {
    setProcessedTodos(todosToComplete);

    try {
      const completionPromises = todosToComplete.map(todo => {
        const completion: RequestCompletion = {
          completed: !todo.completed,
        };

        return updateTodoCompletion(todo.id, completion);
      });

      await Promise.all(completionPromises);
      await getTodosFromServer();

      setProcessedTodos([]);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE_ERROR);
    }
  };

  const handleUpdate = async (todo: Todo, title: string) => {
    setProcessedTodos([todo]);
    if (title.trim() === '') {
      handleDeleteTodo(todo.id);
    } else {
      const updatedData: RequestUpdateTodo = {
        title,
      };

      if (title !== todo.title) {
        try {
          await updateTodo(todo.id, updatedData);
          await getTodosFromServer();
        } catch (error) {
          setErrorType(ErrorTypes.UPDATE_ERROR);
        }
      }

      setProcessedTodos([]);
    }
  };

  const errorTypeHandler = (value: ErrorTypes) => {
    setErrorType(value);
  };

  const contextValue = useMemo(() => {
    return {
      todos,
      errorType,
      tempTodo,
      processedTodos,
      handleFormSubmit,
      handleDeleteTodo,
      handleStatus,
      handleStatusAll,
      clearAll,
      handleUpdate,
      errorTypeHandler,
    };
  }, [todos, errorType, tempTodo, processedTodos]);

  return (
    <TodosContext.Provider value={contextValue}>
      {children}
    </TodosContext.Provider>
  );
};
