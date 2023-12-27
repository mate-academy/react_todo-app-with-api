import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';
import { ProviderProps } from '../../types/ProviderProps';
import { FilterOption } from '../../enum/FilterOption';
import { filterTodos } from '../../helpers/filterTodos';
import { ErrorOption } from '../../enum/ErrorOption';
import { apiClient } from '../../api/todos';

type TodosContextType = {
  todos: Todo[],
  hasError: ErrorOption | null;
  resetHasError: () => void;
  setError: (errMessage: ErrorOption) => void;
  addTodo: (newTodo: Todo) => void;
  removeTodo: (todoId: number) => void;
  recieveTodos: (newTodos: Todo[]) => void,
  setFilterSelected: (filter: FilterOption) => void,
  filterSelected: FilterOption,
  filteredTodos: Todo[],
  toggleTodoCondition: (
    todo: Todo,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
  ) => void,
  updateTodoTitle: (
    todoId: number,
    title: string,
  ) => void,
  resetDeletingTodoIds: () => void,
  addDeletingTodoIds: (newTodoIds: number[]) => void,
  deletingTodoIds: number[],
  toggleAllTodoCondition: () => void,
};

const TodosContext = createContext<TodosContextType>({
  todos: [],
  hasError: ErrorOption.AddTodoError,
  resetHasError: () => {},
  setError: () => {},
  addTodo: () => {},
  removeTodo: () => {},
  recieveTodos: () => {},
  setFilterSelected: () => {},
  filterSelected: FilterOption.All,
  filteredTodos: [],
  toggleTodoCondition: () => {},
  resetDeletingTodoIds: () => {},
  addDeletingTodoIds: () => {},
  deletingTodoIds: [],
  toggleAllTodoCondition: () => {},
  updateTodoTitle: () => {},
});

export const TodosContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState<ErrorOption | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [
    filterSelected,
    setFilterSelected,
  ] = useState<FilterOption>(FilterOption.All);

  const recieveTodos = useCallback(
    (newTodos: Todo[]) => {
      setTodos(newTodos);
    },
    [],
  );

  const filteredTodos = filterTodos({ todos, filterSelected });

  const resetDeletingTodoIds = () => {
    setDeletingTodoIds([]);
  };

  const addDeletingTodoIds = (newTodoIds: number[]) => {
    setDeletingTodoIds(prevTodoIds => [...prevTodoIds, ...newTodoIds]);
  };

  const resetHasError = useCallback(
    () => setHasError(null),
    [],
  );

  const setError = useCallback(
    (errMessage: ErrorOption) => {
      setHasError(errMessage);

      setTimeout(() => resetHasError(), 3000);
    },
    [resetHasError],
  );

  const updateTodoTitle = (todoId: number, title: string) => {
    setTodos(currentTodos => currentTodos.map(currentTodo => (
      currentTodo.id === todoId
        ? { ...currentTodo, title }
        : currentTodo
    )));
  };

  const addTodo = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const removeTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const toggleAllTodoCondition = async () => {
    const hasUncompletedTodos = todos.some(todo => !todo.completed);
    const findedTodos = todos.filter(todo => (
      todo.completed === !hasUncompletedTodos
    ));

    if (!findedTodos.length) {
      return;
    }

    try {
      const updatePromises = findedTodos.map(findedTodo => (
        apiClient.updateTodo(findedTodo.id, {
          ...findedTodo,
          completed: !findedTodo.completed,
        })
      ));

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(currentTodos => {
        return currentTodos.map(todo => (
          updatedTodos.find(updatedTodo => updatedTodo.id === todo.id) || todo
        ));
      });
    } catch (error) {
      setHasError(ErrorOption.UpdateTodoError);
    }
  };

  const toggleTodoCondition = useCallback(
    async (todo: Todo, setIsLoading: (loading: boolean) => void) => {
      try {
        const updatedTodo = await apiClient.updateTodo(todo.id, {
          ...todo,
          completed: !todo.completed,
        });

        setTodos(currentTodos => (
          currentTodos.map(currentTodo => (
            currentTodo.id === todo.id ? updatedTodo : currentTodo
          ))
        ));
      } catch (error) {
        setError(ErrorOption.UpdateTodoError);
      } finally {
        setIsLoading(false);
      }
    },
    [setTodos, setError],
  );

  const TodosProviderValue: TodosContextType = {
    todos,
    addTodo,
    hasError,
    setError,
    removeTodo,
    recieveTodos,
    filteredTodos,
    resetHasError,
    filterSelected,
    updateTodoTitle,
    deletingTodoIds,
    setFilterSelected,
    addDeletingTodoIds,
    toggleTodoCondition,
    resetDeletingTodoIds,
    toggleAllTodoCondition,
  };

  return (
    <TodosContext.Provider value={TodosProviderValue}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => useContext(TodosContext);
