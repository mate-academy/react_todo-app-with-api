import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react';
import {
  updateTodo,
  USER_ID,
  postTodo,
  deleteTodo,
  getTodos,
} from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { Filter, FilterValues } from '../types/Filter';
import { Todo } from '../types/Todo';

// Define the context value type
interface TodoContextType {
  isAddingTodo: boolean;
  isLoadingTodos: boolean;
  isAnyTodoProcessing: boolean;
  filteredTodos: Todo[];
  allCompleted: boolean;
  deleteTodoById: number[];
  editingTodoId: number | null;
  updatingTodoIds: number[];
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  lastOperationTimestamp: number;
  errorMessage: ErrorType | null;
  setEditingTodoId: (id: number | null) => void;
  setFilter: (filter: Filter) => void;
  handleAddTodo: (title: string) => Promise<void>;
  handleUpdateTodoTitle: (id: number, newTitle: string) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleToggleTodo: (todo: Todo) => Promise<void>;
  handleToggleAll: () => Promise<void>;
  handleClearCompleted: () => void;
  setErrorMessage: (error: ErrorType | null) => void;
}

// Create the context
export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);

// Provider props
interface TodoContextProviderProps {
  children: ReactNode;
}

export const TodoContextProvider: React.FC<TodoContextProviderProps> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoById, setDeleteTodoById] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [lastOperationTimestamp, setLastOperationTimestamp] = useState(
    Date.now(),
  );
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [allCompleted, setAllCompleted] = useState<boolean>(false);
  const [isLoadingTodos, setIsLoadingTodos] = useState<boolean>(true);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const isAnyTodoProcessing =
    isAddingTodo || deleteTodoById.length > 0 || updatingTodoIds.length > 0;

  useEffect(() => {
    let newTodos = [...todos];

    switch (filter) {
      case FilterValues.ALL:
        break;
      case FilterValues.ACTIVE:
        newTodos = todos.filter(todo => !todo.completed);
        break;
      case FilterValues.COMPLETED:
        newTodos = todos.filter(todo => todo.completed);
        break;
    }

    setFilteredTodos(newTodos);
  }, [filter, todos]);

  useEffect(() => {
    setIsLoadingTodos(true);
    setErrorMessage(null);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorType.LOAD_TODOS_FAILED);

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => setIsLoadingTodos(false));
  }, []);

  useEffect(() => {
    setAllCompleted(todos.every(todo => todo.completed) && todos.length > 0);
  }, [todos]);

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setUpdatingTodoIds(prevIds => [...prevIds, todo.id]);
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(
        todos.map(element =>
          element.id === updatedTodo.id
            ? { ...element, completed: updatedTodo.completed }
            : element,
        ),
      );
    } catch (error) {
      setErrorMessage(ErrorType.UPDATE_TODO_FAILED);
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setLastOperationTimestamp(Date.now());
      setUpdatingTodoIds(prevIds =>
        prevIds.filter((id: number) => id !== todo.id),
      );
    }
  };

  const handleToggleAll = async () => {
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToProcess = todosToUpdate.map(todo => todo.id);

    setUpdatingTodoIds(prevIds => [...prevIds, ...idsToProcess]);

    const promises = todosToUpdate.map(({ id, completed }) =>
      updateTodo(id, { completed: !completed }),
    );

    try {
      const results = await Promise.allSettled(promises);

      const succesfullyUpdatedIds = new Set<number>();
      let hasError = false;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          succesfullyUpdatedIds.add(todosToUpdate[index].id);
        } else {
          hasError = true;
        }
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (succesfullyUpdatedIds.has(todo.id)) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      );

      if (hasError) {
        setErrorMessage(ErrorType.UPDATE_TODO_FAILED);
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } catch (error) {
    } finally {
      setUpdatingTodoIds(prevIds =>
        prevIds.filter(id => !idsToProcess.includes(id)),
      );
      setLastOperationTimestamp(Date.now());
    }
  };

  const handleAddTodo = async (title: string) => {
    setIsAddingTodo(true);

    const todoToSend = {
      userId: USER_ID,
      title: title,
      completed: false,
    };

    const temporaryTodo = {
      ...todoToSend,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTempTodo(temporaryTodo);

    try {
      const newTodoFromApi = await postTodo(todoToSend);

      setTodos(prevTodos => [...prevTodos, newTodoFromApi]);
    } catch (error) {
      setErrorMessage(ErrorType.ADD_TODO_FAILED);
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      setLastOperationTimestamp(Date.now());
    }
  };

  const handleDeleteTodo = async (id: number): Promise<void> => {
    setDeleteTodoById(prevId => [...prevId, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorType.DELETE_TODO_FAILED);
      setTimeout(() => setErrorMessage(null), 3000);

      throw error;
    } finally {
      setDeleteTodoById(prevIds =>
        prevIds.filter(currentId => currentId !== id),
      );
      setLastOperationTimestamp(Date.now());
    }
  };

  const handleClearCompleted = () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    if (todosToDelete.length === 0) {
      return;
    }

    const idsToProcess = todosToDelete.map(todo => todo.id);

    setDeleteTodoById(prevIds => [...prevIds, ...idsToProcess]);

    const tabOfPromises = todosToDelete.map(todo => deleteTodo(todo.id));

    Promise.allSettled(tabOfPromises)
      .then(results => {
        const successfullyDeletedIds = new Set<number>();
        let hasError = false;

        results.forEach((result, index) => {
          const originalTodoId = todosToDelete[index].id;

          if (result.status === 'fulfilled') {
            successfullyDeletedIds.add(originalTodoId);
          } else {
            hasError = true;
          }
        });

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.has(todo.id)),
        );

        if (hasError) {
          setErrorMessage(ErrorType.DELETE_TODO_FAILED);
          setTimeout(() => setErrorMessage(null), 3000);
        }
      })
      .finally(() => {
        setDeleteTodoById(prevIds =>
          prevIds.filter(id => !idsToProcess.includes(id)),
        );
        setLastOperationTimestamp(Date.now());
      });
  };

  const handleUpdateTodoTitle = async (id: number, newTitle: string) => {
    setUpdatingTodoIds(prevIds => [...prevIds, id]);

    try {
      const updatedTodo = await updateTodo(id, { title: newTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(ErrorType.UPDATE_TODO_FAILED);
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setUpdatingTodoIds(prevIds => prevIds.filter(todoId => todoId !== id));
      setLastOperationTimestamp(Date.now());
    }
  };

  return (
    <TodoContext.Provider
      value={{
        isAddingTodo,
        isLoadingTodos,
        isAnyTodoProcessing,
        filteredTodos,
        allCompleted,
        deleteTodoById,
        editingTodoId,
        updatingTodoIds,
        todos,
        filter,
        tempTodo,
        lastOperationTimestamp,
        errorMessage,
        setEditingTodoId,
        setFilter,
        handleAddTodo,
        handleUpdateTodoTitle,
        handleDeleteTodo,
        handleToggleTodo,
        handleToggleAll,
        handleClearCompleted,
        setErrorMessage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodosContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error(ErrorType.TODO_CONTEXT_LOAD_FAILED);
  }

  return context;
};
