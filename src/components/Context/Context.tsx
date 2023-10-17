import React, {
  ReactNode, createContext, useContext, useEffect, useRef, useState,
} from 'react';
import * as serviceTodo from '../../api/todos';
import { Todo } from '../../types/Todo';

const USER_ID = 11585;

interface TodosContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  errVisible: boolean;
  setErrVisible: React.Dispatch<React.SetStateAction<boolean>>;
  USER_ID: number;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  deleteTodo: (todoId: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateTodo: (e: React.FormEvent) => void;
  newTodo: string;
  disableInput: boolean;
  isLoading: boolean;
  tempTodo: Todo | null;
  loadingTodoId: number | null;
  clearCompleted: () => void;
  completTodo: (todo: Todo) => void;
  toggleAll: () => Promise<void>;
  allCompleted: boolean;
  isEditing: number | null;
  setIsEditingId: React.Dispatch<React.SetStateAction<number | null>>
  editTitle: (updatedTodo: Todo) => Promise<void>;
  headerInputRef: React.MutableRefObject<HTMLInputElement | null>;
  countActiveTodos: () => number;
  todoInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export const TodosProvider: React
  .FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const [err, setError] = useState<string>('');
  const [errVisible, setErrVisible] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>('all');

  const [newTodo, setNewTodo] = useState<string>('');

  const [disableInput, setDisableInput] = useState<boolean>(false);

  const [isEditing, setIsEditingId] = useState<number | null>(null);

  const headerInputRef = useRef<HTMLInputElement | null>(null);
  const todoInputRef = useRef<HTMLInputElement | null>(null);

  const countActiveTodos = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const showError = (message: string) => {
    setError(message);
    setErrVisible(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timer) {
      clearTimeout(timer);
    }

    if (errVisible) {
      timer = setTimeout(() => {
        setError('');
        setErrVisible(false);
      }, 3000);
    }
  }, [errVisible]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableInput(true);
    if (newTodo.trim() === '') {
      showError('Title should not be empty');
      setDisableInput(false);
      setNewTodo('');

      return;
    }

    const newTodoItem: Todo = {
      id: 0,
      title: newTodo.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodoItem);

    try {
      const loadedTodo = await serviceTodo.createTodo(newTodoItem);

      setTempTodo(loadedTodo as Todo);
      setTodos([...todos, loadedTodo as Todo]);
      setNewTodo('');
    } catch (error) {
      setDisableInput(false);
      showError('Unable to add a todo');
    } finally {
      setIsLoading(false);
      setTempTodo(null);
      setDisableInput(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (todoToDelete) {
      setTodos(todos.filter(t => t.id !== todoId));
      setLoadingTodoId(todoId);
      try {
        await serviceTodo.deleteTodo(todoId);
      } catch (error) {
        showError('Unable to delete a todo');
      } finally {
        setLoadingTodoId(null);
      }
    }
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    if (updatedTodos && completedTodos) {
      setTodos(updatedTodos);
      completedTodos.forEach(async todo => {
        setIsLoading(true);
        try {
          await serviceTodo.deleteTodo(todo.id);
        } catch (error) {
          showError('Unable to delete a todo');
        } finally {
          setLoadingTodoId(null);
          setIsLoading(false);
        }
      });
    }
  };

  const completTodo = async (updatedTodo: Todo) => {
    const newUpdatedTodos = todos.map(t => {
      return t.id === updatedTodo.id ? { ...t, completed: !t.completed } : t;
    });

    if (newUpdatedTodos) {
      setTodos(newUpdatedTodos);
      setLoadingTodoId(updatedTodo.id);
      try {
        await serviceTodo
          .updateTodo(updatedTodo.id, { completed: !updatedTodo.completed });
      } catch {
        showError('Unable to update a todo');
      } finally {
        setLoadingTodoId(null);
      }
    }
  };

  const allCompleted = todos.every(todo => todo.completed);

  const toggleAll = async () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setIsLoading(true);

    setTodos(updatedTodos);

    try {
      await Promise.all(updatedTodos
        .map(todo => serviceTodo.updateTodo(todo.id, todo)));
    } catch (error) {
      showError('Unable to update todos');
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (updatedTodo: Todo) => {
    setIsEditingId(updatedTodo.id);

    try {
      setLoadingTodoId(updatedTodo.id);
      await serviceTodo
        .updateTodo(updatedTodo.id, { title: updatedTodo.title });

      const updatedTodos = todos.map(todo => {
        return (todo.id === updatedTodo.id
          ? { ...todo, title: updatedTodo.title }
          : todo);
      });

      setTodos(updatedTodos);
    } catch (error) {
      showError('Unable to update todo title');
    } finally {
      setLoadingTodoId(null);
    }
  };

  useEffect(() => {
    if (headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [todos.length]);

  useEffect(() => {
    serviceTodo.getTodos(USER_ID)
      .then((todosData) => {
        setTodos(todosData);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  const contextValues = {
    todos,
    setTodos,
    error: err,
    setError,
    errVisible,
    setErrVisible,
    USER_ID,
    filter,
    setFilter,
    deleteTodo,
    handleInputChange,
    handleCreateTodo,
    newTodo,
    disableInput,
    isLoading,
    tempTodo,
    loadingTodoId,
    clearCompleted,
    completTodo,
    toggleAll,
    allCompleted,
    isEditing,
    setIsEditingId,
    editTitle,
    headerInputRef,
    countActiveTodos,
    todoInputRef,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = (): TodosContextType => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};
