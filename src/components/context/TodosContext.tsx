import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as todosServices from '../../api/api';
import { useError } from './ErrorContext';
import { Status, TodoError } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/todos';

interface TodosContextType {
  todos: Todo[];
  statusTodo: Status;
  tempTodo: Todo | null;
  isProcessing: number[];
  setIsProcessing: Dispatch<SetStateAction<number[]>>;
  setTempTodo: (_todo: Todo) => void;
  removeTodo: (_todoId: number) => Promise<void>;
  updateTodo: (_updatedTodo: Todo) => Promise<void>;
  addTodo: (_todo: Todo) => Promise<void>;
  toggleOne: (_updatedTodo: Todo) => void;
  handleClearCompleted: () => void;
  toggleAll: () => void;
  setStatusTodo: (_statusTodo: Status) => void;
}

const contextValue: TodosContextType = {
  todos: [],
  statusTodo: Status.All,
  tempTodo: null,
  isProcessing: [],
  setIsProcessing: () => {},
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
  const [isProcessing, setIsProcessing] = useState<number[]>([]);
  const { setErrorMessage } = useError();

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todosServices.getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage(TodoError.UnableToLoad);
      }
    };

    fetchTodos();
  }, [setErrorMessage]);

  const addTodo = async ({ title, completed, userId }: Todo) => {
    setIsProcessing(prev => [...prev, 0]);
    setErrorMessage(TodoError.NoError);

    setTempTodo({
      id: 0,
      title,
      userId,
      completed: false,
    });

    try {
      const newTodo = await todosServices.postTodos({
        title,
        completed,
        userId: USER_ID,
      });

      setTempTodo(null);
      setTodos(currTodos => [...currTodos, newTodo]);
    } catch (error) {
      setErrorMessage(TodoError.UnableToAdd);
      setTempTodo(null);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setIsProcessing(prevIds => [...prevIds, todoId]);

    try {
      await todosServices.deleteTodos(todoId);
      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
      setIsProcessing(prevIds => prevIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage(TodoError.UnableToDelete);
      throw error;
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    setIsProcessing(prevIds => [...prevIds, updatedTodo.id]);

    try {
      const todoEdited = await todosServices.updateTodo(updatedTodo);

      setTodos(currTodos =>
        currTodos.map(todo => (todo.id === updatedTodo.id ? todoEdited : todo)),
      );
    } catch (error) {
      setErrorMessage(TodoError.UnableUpdate);
      throw error;
    } finally {
      setIsProcessing(prevIds => prevIds.filter(id => id !== updatedTodo.id));
    }
  };

  const toggleOne = async (toggledTodo: Todo) => {
    setErrorMessage(TodoError.NoError);
    setIsProcessing(prevIds => [...prevIds, toggledTodo.id]);

    try {
      const toggled = await todosServices.updateTodo({
        ...toggledTodo,
        completed: !toggledTodo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          toggled.id === todo.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    } catch {
      setErrorMessage(TodoError.UnableUpdate);
    } finally {
      setIsProcessing(prevIds => prevIds.filter(id => id !== toggledTodo.id));
    }
  };

  const toggleAll = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleOne(todo));
    } else {
      completedTodos.forEach(todo => toggleOne(todo));
    }
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  const contextValueMemo = useMemo(
    () => ({
      todos,
      statusTodo,
      tempTodo,
      isProcessing,
      setIsProcessing,
      setTempTodo,
      removeTodo,
      addTodo,
      updateTodo,
      toggleOne,
      toggleAll,
      handleClearCompleted,
      setStatusTodo,
    }),
    [todos, statusTodo, tempTodo],
  );

  return (
    <TodosContext.Provider value={contextValueMemo}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};
