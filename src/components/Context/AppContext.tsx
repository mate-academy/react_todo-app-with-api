import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import { AppContextType } from '../../types/AppContextType';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  children: React.ReactNode,
};

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [errorType, setErrorType] = useState('');
  const [processing, setProcessing] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorType(ErrorTypes.load);
      });
  }, []);

  const downloadTodos = () => {
    return todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorType(ErrorTypes.load);
        throw new Error('Unable to load a todos');
      });
  };

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      await todoService.deleteTodo(todoId);
      await downloadTodos();
    } catch {
      setErrorType(ErrorTypes.delete);
      throw new Error('Unable to delete a todos');
    }
  }, []);

  const updateTodo = useCallback(async (todoData: Partial<Todo>) => {
    const {
      id,
      completed,
      userId,
      title,
    } = todoData;

    try {
      await todoService.updateTodo(id, { completed, userId, title });
      await downloadTodos();
    } catch {
      setErrorType(ErrorTypes.update);
      throw new Error('Unable to delete a todos');
    }
  }, []);

  const createTodo = useCallback(async (todoData: Partial<Todo>) => {
    const {
      completed,
      title,
    } = todoData;

    try {
      await todoService.createTodo({ completed, title });
      await downloadTodos();
      setTodoTitle('');
    } catch {
      setErrorType(ErrorTypes.add);
      throw new Error('Unable to delete a todos');
    }
  }, []);

  const handleToggleAllTodos = () => {
    const arrOfPromises: Promise<unknown>[] = [];
    const activeTodosId = todos
      .filter(todo => !todo.completed)
      .map(todo => todo.id);

    if (activeTodosId.length > 0) {
      activeTodosId.forEach((id) => {
        setProcessing((currentState) => [...currentState, id]);
        arrOfPromises.push(updateTodo({ id, completed: true }));
      });
    } else {
      todos.forEach((item) => {
        setProcessing((currentState) => [...currentState, item.id]);
        arrOfPromises.push(updateTodo({ id: item.id, completed: false }));
      });
    }

    Promise.all(arrOfPromises)
      .then(() => {
        downloadTodos()
          .finally(() => {
            setProcessing([]);
          });
      })
      .catch(() => {
        setProcessing([]);
      });
  };

  const handleHeaderFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (todoTitle.trim().length === 0) {
      setErrorType(ErrorTypes.title);
      setTodoTitle('');

      return;
    }

    const newTodo = {
      title: todoTitle,
      userId: 11230,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    createTodo(newTodo)
      .then(() => {
        setTempTodo(null);
      });
  };

  const handleClearCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessing([...completedTodosId]);

    Promise.all(completedTodosId.map((id) => {
      return deleteTodo(id);
    }))
      .then(() => {
        downloadTodos();
      })
      .catch(() => {
        setErrorType(ErrorTypes.delete);
        setProcessing([]);
      });
  };

  const value = {
    todos,
    todoTitle,
    onTodoTitleChange: (val: string) => setTodoTitle(val),
    filterType,
    setFilterType,
    errorType,
    setErrorType,
    processing,
    setProcessing,
    tempTodo,
    // functions for handling events
    downloadTodos,
    deleteTodo,
    updateTodo,
    createTodo,
    handleToggleAllTodos,
    handleHeaderFormSubmit,
    handleClearCompleted,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('AppContext is not exist');
  }

  return appContext;
}
