import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as todosServices from '../../api/api';
import { useError } from './ErrorContext';
import { Status, TodoError } from '../../types/enums';
import { Todo } from '../../types/Todo';

interface TodosContextType {
  todos: Todo[];
  statusTodo: Status;
  tempTodo: Todo | null;
  inputTodo: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setInputTodo: (inputTodo: string) => void;
  loadingTodoIds: number[];
  setLoadingTodoIds: Dispatch<SetStateAction<number[]>>;
  setTempTodo: (_todo: Todo) => void;
  removeTodo: (_todoId: number) => Promise<void>;
  updateTodo: (
    _updatedTodo: Todo,
    setIdEditing: (id: number | null) => {},
  ) => Promise<void>;
  addTodo: (_todo: Todo) => Promise<void>;
  toggleOne: (_updatedTodo: number) => void;
  handleClearCompleted: () => void;
  toggleAll: () => void;
  setStatusTodo: (_statusTodo: Status) => void;
}

const contextValue: TodosContextType = {
  todos: [],
  statusTodo: Status.All,
  tempTodo: null,
  loadingTodoIds: [],
  inputTodo: '',
  isLoading: false,
  setIsLoading: () => {},
  setInputTodo: () => {},
  setLoadingTodoIds: () => {},
  setTempTodo: () => {},
  removeTodo: async () => {},
  updateTodo: async () => {},
  addTodo: async () => {},
  toggleOne: async () => {},
  handleClearCompleted: async () => {},
  toggleAll: () => {},
  setStatusTodo: () => {},
};

export const TodosContext = React.createContext<TodosContextType>(contextValue);

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusTodo, setStatusTodo] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [inputTodo, setInputTodo] = useState('');
  const { setErrorMessage } = useError();

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    setIsLoading(true);

    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todosServices.getTodos();

        setTodos(fetchedTodos);
      } catch {
        setErrorMessage(TodoError.UnableToLoad);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setLoadingTodoIds(prev => [...prev, 0]);

    try {
      const newTodos = await todosServices.postTodos(newTodo);

      setTodos(currTodos => [...currTodos, newTodos]);
      setInputTodo('');
    } catch {
      setErrorMessage(TodoError.UnableToAdd);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== 0));
    }
  };

  const removeTodo = async (todoId: number) => {
    setIsLoading(true);
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await todosServices.deleteTodos(todoId);
      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(TodoError.UnableToDelete);
    } finally {
      setIsLoading(false);
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const updateTodo = async (
    updatedTodo: Todo,
    setIdEditing: (id: number | null) => {},
  ) => {
    setIsLoading(true);
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);

    try {
      const todoEdited = await todosServices.updateTodo(updatedTodo);

      setTodos(currTodos =>
        currTodos.map(todo => (todo.id === updatedTodo.id ? todoEdited : todo)),
      );

      setIdEditing(null);
    } catch {
      setErrorMessage(TodoError.UnableUpdate);
    } finally {
      setIsLoading(false);
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== updatedTodo.id));
    }
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  const changeTodoStatus = async (id: number, status: boolean) => {
    setIsLoading(true);
    setLoadingTodoIds(prev => [...prev, id]);

    const preparedForUpdate = todos.find(todo => todo.id === id);

    if (preparedForUpdate) {
      try {
        await todosServices.toggleTodoStatus(id, status);
        setTodos(prevTodos =>
          prevTodos.map(prev =>
            prev.id === id ? { ...prev, completed: status } : prev,
          ),
        );
      } catch {
        setErrorMessage(TodoError.UnableUpdate);
      } finally {
        setIsLoading(false);
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      }
    }
  };

  const toggleOne = (id: number) => {
    const preparedToUpdate = todos.find(todo => todo.id === id);

    if (preparedToUpdate) {
      changeTodoStatus(id, !preparedToUpdate.completed);
    }
  };

  const toggleAll = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleOne(todo.id));
    } else {
      completedTodos.forEach(todo => toggleOne(todo.id));
    }
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        statusTodo,
        tempTodo,
        loadingTodoIds,
        setLoadingTodoIds,
        inputTodo,
        isLoading,
        setIsLoading,
        setInputTodo,
        setTempTodo,
        removeTodo,
        addTodo,
        updateTodo,
        toggleOne,
        toggleAll,
        handleClearCompleted,
        setStatusTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodos must be used within an TodosProvider');
  }

  return context;
};
