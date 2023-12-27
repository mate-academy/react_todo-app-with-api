import {
  useCallback,
  useState,
  useMemo,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import * as TodoMethods from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TypeOfFilter } from '../../types/TypeOfFilters';
import { Error } from '../../types/TypeOfErrors';

const USER_ID = 12049;

interface AppContextTodoType {
  USER_ID: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filterType: TypeOfFilter,
  setFilterType: React.Dispatch<React.SetStateAction<TypeOfFilter>>,
  errors: Error | null,
  setErrors: React.Dispatch<React.SetStateAction<Error | null>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  filteredTodos: Todo[],
  deleteTodoHandler: (value: number) => void,
  addTodoTitle: (todo: Omit<Todo, 'id'>) => Promise<void>,
  deletedIds: number[],
  setDeletedIds: (value: number[]) => void,
  updateTodos: (updatedTodo: Todo) => void,
  toggleAllToCompletedTodos: () => void,
}

export const appContext = createContext<AppContextTodoType>({
  USER_ID: 12049,
  todos: [],
  setTodos: () => { },
  filterType: TypeOfFilter.All,
  setFilterType: () => {},
  errors: null,
  setErrors: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isLoading: false,
  setIsLoading: () => {},
  filteredTodos: [],
  deleteTodoHandler: () => {},
  addTodoTitle: async () => {},
  deletedIds: [],
  setDeletedIds: () => {},
  updateTodos: () => {},
  toggleAllToCompletedTodos: () => {},
});

type Props = {
  children: ReactNode;
};

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<TypeOfFilter>(TypeOfFilter.All);
  const [errors, setErrors] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case TypeOfFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TypeOfFilter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterType]);

  useEffect(() => {
    TodoMethods.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrors(Error.LoadTodos));
  }, []);

  const deleteTodoHandler = useCallback(
    (todoId: number) => {
      setDeletedIds((prevIds) => [...prevIds, todoId]);

      setTimeout(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));

        return TodoMethods.deleteTodo(todoId)
          .then(() => setDeletedIds([]))
          .catch(() => {
            setErrors(Error.DeleteTodo);
            setTodos(todos);
            setDeletedIds(prevIds => (
              prevIds.filter(prevId => prevId !== todoId)
            ));
          });
      }, 500);
    }, [todos],
  );

  const addTodoTitle = useCallback(
    ({ title, completed, userId }: Omit<Todo, 'id'>) => {
      setTempTodo({
        id: 0,
        title,
        completed,
        userId,
      });

      setIsLoading(true);

      return TodoMethods.addTodo({ title, completed, userId })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch(() => {
          setErrors(Error.AddTodo);
        })
        .finally(() => setTempTodo(null));
    }, [],
  );

  const updateTodos = useCallback((updatedTodo: Todo) => {
    setDeletedIds(prevIds => [...prevIds, updatedTodo.id]);

    setTimeout(() => {
      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id !== updatedTodo.id ? todo : updatedTodo
      )));

      return TodoMethods.updateTodo(updatedTodo)
        .catch(() => setErrors(() => Error.UpdateTodo))
        .finally(() => {
          setDeletedIds(prevIds => (
            prevIds.filter(prevId => prevId !== updatedTodo.id)
          ));
        });
    }, 500);
  }, []);

  const toggleAllToCompletedTodos = useCallback(() => {
    const filterCompleted = todos.filter(todo => !todo.completed);

    filterCompleted.forEach(todo => {
      updateTodos({
        ...todo,
        completed: !todo.completed,
      });
    });

    if (!filterCompleted.length) {
      todos.forEach(todo => {
        updateTodos({
          ...todo,
          completed: !todo.completed,
        });
      });
    }
  }, [todos, updateTodos]);

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    filterType,
    setFilterType,
    errors,
    setErrors,
    tempTodo,
    setTempTodo,
    addTodoTitle,
    deleteTodoHandler,
    filteredTodos,
    isLoading,
    setIsLoading,
    deletedIds,
    setDeletedIds,
    updateTodos,
    toggleAllToCompletedTodos,
  }), [
    todos,
    filterType,
    errors,
    tempTodo,
    addTodoTitle,
    deleteTodoHandler,
    filteredTodos,
    isLoading,
    deletedIds,
    updateTodos,
    toggleAllToCompletedTodos,
  ]);

  return (
    <appContext.Provider value={value}>
      {children}
    </appContext.Provider>
  );
};
