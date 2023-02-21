import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Status';
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
  query: string,
  filter: Filter,
  errorType: ErrorTypes,
  tempTodo: Todo | null,
  todos: Todo[],
  processedTodos: Todo[],
  handleInput: (value: string) => void,
  handleFormSubmit: () => void,
  handleDeleteTodo: (todoId: number) => void,
  handleStatus: (todo: Todo) => void,
  handleStatusAll: (todos: Todo[]) => void,
  handleFilter: (value: Filter) => void,
  clearAll: (todos: Todo[]) => void,
  handleUpdate: (todo: Todo, title: string) => void,
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  query: '',
  tempTodo: temporaryTodo,
  filter: Filter.ALL,
  errorType: ErrorTypes.NONE,
  processedTodos: [],
  handleInput: () => {},
  handleFormSubmit: () => {},
  handleDeleteTodo: () => {},
  handleStatus: () => {},
  handleStatusAll: () => {},
  handleFilter: () => {},
  clearAll: () => {},
  handleUpdate: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);

  const newTodo: RequestTodo = {
    userId: USER_ID,
    title: query,
    completed: false,
  };

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

  const handleInput = (value: string) => {
    setQuery(value);
  };

  const handleFormSubmit = async () => {
    if (query.trim() === '') {
      setQuery('');
      setErrorType(ErrorTypes.EMPTY_TITLE);
    } else {
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        const todoFromServer = await addTodo(USER_ID, newTodo);

        setTodos(prevState => [...prevState, todoFromServer]);
        setTempTodo(null);
        setQuery('');
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
        setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
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
        setTodos(prevState => prevState
          .filter(todo => processedTodos.find(t => t.id === todo.id)));
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
      const updatedTodo = await updateTodoCompletion(todo.id, completion);

      setTodos(prevState => prevState.map(currentTodo => {
        if (currentTodo.id === updatedTodo.id) {
          return updatedTodo;
        }

        return currentTodo;
      }));

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
      setTodos(prevState => prevState.map(todo => {
        const todoToChange = todosToComplete.find(t => t.id === todo.id);

        if (todoToChange) {
          todoToChange.completed = !todoToChange.completed;

          return todoToChange;
        }

        return todo;
      }));

      setProcessedTodos([]);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE_ERROR);
    }
  };

  const handleFilter = (value: Filter) => {
    setFilter(value);
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
          const todoFromServer = await updateTodo(todo.id, updatedData);

          setTodos(prevState => [...prevState, todoFromServer]);
        } catch (error) {
          setErrorType(ErrorTypes.UPDATE_ERROR);
        }
      }
    }
  };

  const contextValue = useMemo(() => {
    return {
      query,
      todos,
      filter,
      errorType,
      tempTodo,
      processedTodos,
      handleInput,
      handleFormSubmit,
      handleDeleteTodo,
      handleStatus,
      handleStatusAll,
      handleFilter,
      clearAll,
      handleUpdate,
    };
  }, [todos, query, filter, errorType, tempTodo, processedTodos]);

  return (
    <TodosContext.Provider value={contextValue}>
      {children}
    </TodosContext.Provider>
  );
};
