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
import { useTodosFilter } from '../../helpers/useTodosFilter';
import { ErrorOption } from '../../enum/ErrorOption';
import { apiClient } from '../../api/todos';

type TodosContextType = {
  todos: Todo[],
  hasError: ErrorOption;
  resetHasError: () => void;
  setError: (errMessage: ErrorOption) => void;
  addTodo: (newTodo: Todo) => void;
  removeTodo: (todoId: number) => void;
  recieveTodos: (newTodos: Todo[]) => void,
  setFilterSelected: (filter: FilterOption) => void,
  filterSelected: FilterOption,
  filteredTodos: Todo[],
  toggleTodoCondition: (
    todoId: number,
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
  hasError: ErrorOption.Clear,
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
  const [hasError, setHasError] = useState(ErrorOption.Clear);
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

  const filteredTodos = useTodosFilter({ todos, filterSelected });

  const resetDeletingTodoIds = () => {
    setDeletingTodoIds([]);
  };

  const addDeletingTodoIds = (newTodoIds: number[]) => {
    setDeletingTodoIds(prevTodoIds => [...prevTodoIds, ...newTodoIds]);
  };

  const resetHasError = useCallback(
    () => setHasError(ErrorOption.Clear),
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
    const copyTodos = [...todos];

    const findedTodo = copyTodos.find(todo => todo.id === todoId) || null;

    if (!findedTodo) {
      return;
    }

    const indexFindedTodo = copyTodos.indexOf(findedTodo);
    const updatedTodo = {
      ...findedTodo,
      title,
    };

    copyTodos[indexFindedTodo] = updatedTodo;

    setTodos(copyTodos);
  };

  const addTodo = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const removeTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const toggleAllTodoCondition = async () => {
    const findedTodos = todos.filter(outerTodo => {
      const uncompletedTodos = todos.filter(innerTodo => !innerTodo.completed);

      if (uncompletedTodos.length > 0) {
        return !outerTodo.completed;
      }

      return outerTodo.completed;
    });

    if (findedTodos.length === 0) {
      return;
    }

    try {
      const updatePromises = findedTodos.map(async findedTodo => {
        const updatedTodo = await apiClient.updateTodo(findedTodo.id, {
          ...findedTodo,
          completed: !findedTodo.completed,
        });

        return updatedTodo;
      });

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

  const toggleTodoCondition = async (
    todoId: number,
    setIsLoading: (loading: boolean) => void,
  ) => {
    const findedTodo = todos.find(todo => todo.id === todoId) || null;

    if (!findedTodo) {
      return;
    }

    try {
      const updatedTodo = await apiClient.updateTodo(todoId, {
        ...findedTodo,
        completed: !findedTodo.completed,
      });

      const copyTodos = [...todos];
      const indexFindedTodo = copyTodos.indexOf(findedTodo);

      copyTodos[indexFindedTodo] = updatedTodo;

      setTodos(copyTodos);
    } catch (error) {
      setError(ErrorOption.UpdateTodoError);
    } finally {
      setIsLoading(false);
    }
  };

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
