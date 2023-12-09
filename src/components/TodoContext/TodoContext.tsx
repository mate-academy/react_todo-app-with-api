import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { UserWarning } from '../../UserWarning';
import * as todosService from '../../api/todos';

const USER_ID = 11383;

type Props = {
  children: React.ReactNode;
};

type TodoContextValue = {
  todos: Todo[];
  todosUncompleted: number;
  todosCompleted: Todo[];
  addTodo: (inputValue: string) => void;
  toggleTodo: (selectedTodo: Todo) => void;
  toogleAll: () => void;
  deleteTodo: (todo: Todo) => void;
  deleteComplitedTodo: () => void;
  updateTodo: (updatedTitle: string, todo: Todo) => void;
  isError: { isError: boolean, message: string }
  setIsError: (isError: { isError: boolean; message: string }) => void;
  tempoTodo: Todo | null;
  setTempoTodo: (tempoTodo: Todo | null) => void;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  isOnAdd: boolean;
  setIsOnAdd: (isOnAdd: boolean) => void;
  isCompliteDeleting: boolean;
  isToogleAllClick: boolean;
  isTodoOnUpdate: Todo | null;
  resetError: () => void;
  handleAddTodoError: (errorMessage: string) => void;
};

export const TodoContext = React.createContext<TodoContextValue>({
  todos: [],
  todosUncompleted: 0,
  todosCompleted: [],
  addTodo: () => {},
  toggleTodo: () => {},
  toogleAll: () => {},
  deleteTodo: () => { },
  deleteComplitedTodo: () => { },
  updateTodo: () => { },
  isError: { isError: false, message: '' },
  setIsError: () => {},
  tempoTodo: null,
  setTempoTodo: () => {},
  inputValue: '',
  setInputValue: () => {},
  isOnAdd: false,
  setIsOnAdd: () => {},
  isCompliteDeleting: false,
  isToogleAllClick: false,
  isTodoOnUpdate: null,
  resetError: () => {},
  handleAddTodoError: () => {},
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [isError, setIsError] = useState({ isError: false, message: '' });
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [isOnAdd, setIsOnAdd] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCompliteDeleting, setIsCompliteDeleting] = useState(false);
  const [isToogleAllClick, setIsToogleAllClick] = useState(false);
  const [isTodoOnUpdate, setIsTodoOnUpdate] = useState<Todo | null>(null);
  let timeoutId: NodeJS.Timeout | null;

  const resetError = () => {
    setIsError({ isError: false, message: '' });
  };

  const handleAddTodoError = (errorMessage: string) => {
    setIsError({ isError: true, message: errorMessage });
  };

  useEffect(() => {
    if (isError.isError) {
      timeoutId = setTimeout(() => {
        resetError();
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isError, resetError]);

  const updateTodoHelper = async (
    updatedTodo: Todo, updateFunction: (todo: Todo) => Promise<Todo>,
  ) => {
    setIsTodoOnUpdate(updatedTodo);

    try {
      const updatedTodoFromServer = await updateFunction(updatedTodo);

      if (updatedTodoFromServer) {
        const updatedTodos = todos.map(todo => (
          todo.id === updatedTodoFromServer.id ? updatedTodoFromServer : todo
        ));

        setTodos(updatedTodos);
      }
    } catch (error) {
      handleAddTodoError('Unable to update todo');
    } finally {
      setIsTodoOnUpdate(null);
    }
  };

  useEffect(() => {
    if (USER_ID) {
      todosService.getTodos(USER_ID)
        .then((fetchedTodos) => {
          setTodos(fetchedTodos);
        })
        .catch((error) => {
          setIsError({ isError: true, message: `${error}` });
        });
    }
  }, []);

  const todosUncompleted = useMemo(() => todos.filter(
    todo => !todo.completed,
  ).length, [todos]);

  const todosCompleted = useMemo(() => todos.filter(
    todo => todo.completed,
  ), [todos]);

  // #region Add Todo Section
  const createTempTodo = () => ({
    id: 0,
    userId: USER_ID,
    title: inputValue,
    completed: false,
  });

  const resetAddTodoState = () => {
    setTempoTodo(null);
    setInputValue('');
    setIsOnAdd(false);
  };

  const addTodo = async () => {
    setIsOnAdd(true);

    try {
      const tempTodo = createTempTodo();

      setTempoTodo(tempTodo);
      const newTodo = await todosService.createTodo(tempTodo);

      if (newTodo) {
        setTodos([...todos, newTodo]);
      }
    } catch (error) {
      handleAddTodoError('Unable to add a todo');
    } finally {
      resetAddTodoState();
    }
  };
  // #endregion Add Todo Section

  // #region Update Todo Section
  const toggleTodo = async (selectedTodo: Todo) => {
    const updatedTodo = { ...selectedTodo, completed: !selectedTodo.completed };

    await updateTodoHelper(updatedTodo, todosService.updateTodo);
  };

  const toogleAll = async () => {
    setIsToogleAllClick(true);

    const allCompleted = todos.every(todo => todo.completed === true);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    try {
      const tooglePromise = updatedTodos.map(
        todo => todosService.updateTodo(todo),
      );

      await Promise.all(tooglePromise);
      setTodos(updatedTodos);
    } catch (error) {
      handleAddTodoError('Unable to update todos');
    } finally {
      setIsToogleAllClick(false);
    }
  };

  const updateTodo = async (updatedTitle: string, selectedTodo: Todo) => {
    const updatedTodo = { ...selectedTodo, title: updatedTitle };

    await updateTodoHelper(updatedTodo, todosService.updateTodo);
  };
  // #endregion Update Todo Section

  // #region Delete Todo Section
  const deleteTodo = async (selectedTodo: Todo) => {
    setIsTodoOnUpdate(selectedTodo);
    try {
      await todosService.deleteTodo(selectedTodo.id);
      setTodos(todos.filter(todo => todo.id !== selectedTodo.id));
    } catch (error) {
      handleAddTodoError('Unable to delete a todo');
    } finally {
      setIsTodoOnUpdate(null);
    }
  };

  const deleteComplitedTodo = async () => {
    if (todosCompleted.length > 0) {
      setIsCompliteDeleting(true);
      try {
        const deletionPromises = todosCompleted.map(
          todo => todosService.deleteTodo(todo.id),
        );

        await Promise.all(deletionPromises);
        setTodos(todos.filter(todo => !todo.completed));
      } catch (error) {
        handleAddTodoError('Unable to delete a todo');
      } finally {
        setIsCompliteDeleting(false);
      }
    }
  };
  // #endregion Delete Todo Section

  const contextValue: TodoContextValue = {
    todos,
    todosUncompleted,
    todosCompleted,
    addTodo,
    toggleTodo,
    toogleAll,
    deleteTodo,
    deleteComplitedTodo,
    updateTodo,
    isError,
    setIsError,
    resetError,
    tempoTodo,
    setTempoTodo,
    inputValue,
    setInputValue,
    isOnAdd,
    setIsOnAdd,
    isCompliteDeleting,
    isToogleAllClick,
    isTodoOnUpdate,
    handleAddTodoError,
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextValue => React.useContext(TodoContext);
