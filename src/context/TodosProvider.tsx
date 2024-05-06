import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { TodosError } from '../types/TodosErrors';
import { TempTodo } from '../types/TempTodo';
import { USER_ID, addTodo, deleteTodo, updateTodo } from '../api/todos';

export type TodosContextType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: TempTodo;
  setTempTodo: Dispatch<SetStateAction<TempTodo>>;
  todosInProcess: number[];
  setTodosInProcess: Dispatch<SetStateAction<number[]>>;
  filter: FilterType;
  handleFilterChange: (filterStatus: FilterType) => VoidFunction;
  errorMessage: TodosError;
  handleErrorMessage: (error: TodosError) => VoidFunction;
  handleAddTodo: (
    query: string,
    setQuery: Dispatch<SetStateAction<string>>,
  ) => void;
  handleDeleteTodo: (
    todoId: number,
    updateState?: VoidFunction,
  ) => VoidFunction;
  handleUpdateTodo: (todo: Todo, updateState?: VoidFunction) => VoidFunction;
};

export const TodosContext = createContext({
  todos: [] as Todo[],
  setTodos: (() => {}) as Dispatch<SetStateAction<Todo[]>>,
  tempTodo: null as TempTodo,
  setTempTodo: (() => {}) as Dispatch<SetStateAction<TempTodo>>,
  todosInProcess: [] as number[],
  setTodosInProcess: (() => {}) as Dispatch<SetStateAction<number[]>>,
  filter: 'All' as FilterType,
  handleFilterChange: (_filterStatus: FilterType) => () => {},
  errorMessage: TodosError.NONE,
  handleErrorMessage: (_error: TodosError) => () => {},
  handleAddTodo: (
    _query: string,
    _setQuery: Dispatch<SetStateAction<string>>,
  ) => {},
  handleDeleteTodo: (_todoId: number) => () => {},
  handleUpdateTodo: (_todo: Todo, _updateState?: VoidFunction) => () => {},
});

type Props = {
  children: ReactNode;
};

export const TodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [errorMessage, setErrorMessage] = useState<TodosError>(TodosError.NONE);
  const [tempTodo, setTempTodo] = useState<TempTodo>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);

  const handleFilterChange = (filterStatus: FilterType) => () => {
    setFilter(filterStatus);
  };

  const handleErrorMessage = (message: TodosError) => () => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(TodosError.NONE);
    }, 3000);
  };

  const handleDeleteTodo =
    (todoId: number, updateState?: VoidFunction) => () => {
      setTodosInProcess(prevTodosInProcess => [...prevTodosInProcess, todoId]);
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
          updateState?.();
        })
        .catch(handleErrorMessage(TodosError.DELETE_TODO))
        .finally(() => {
          setTodosInProcess(prevIds =>
            prevIds.filter(processId => processId !== todoId),
          );
        });
    };

  const handleAddTodo = (
    query: string,
    setQuery: Dispatch<SetStateAction<string>>,
  ) => {
    if (!query.trim()) {
      handleErrorMessage(TodosError.EMPTY_TITLE)();

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      completed: false,
      title: query.trim(),
    });

    addTodo(query.trim())
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setQuery('');
      })
      .catch(handleErrorMessage(TodosError.ADD_TODO))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleUpdateTodo =
    (todo: Todo, updateState?: (title?: string) => void) => () => {
      const { id, ...restTodo } = todo;

      setTodosInProcess(prevTodosInProcess => [...prevTodosInProcess, id]);

      updateTodo(id, restTodo)
        .then(updatedTodo => {
          const typedUpdatedTodo = updatedTodo as Todo;

          setTodos((prevTodos: Todo[]) => {
            return prevTodos.map((t: Todo) =>
              t.id === id ? typedUpdatedTodo : t,
            ) as Todo[];
          });
          updateState?.(typedUpdatedTodo.title);
        })
        .catch(handleErrorMessage(TodosError.UPDATE_TODO))
        .finally(() => {
          setTodosInProcess(prevIds =>
            prevIds.filter(processId => processId !== id),
          );
        });
    };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        tempTodo,
        setTempTodo,
        todosInProcess,
        setTodosInProcess,
        filter,
        handleFilterChange,
        errorMessage,
        handleErrorMessage,
        handleAddTodo,
        handleDeleteTodo,
        handleUpdateTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = (): TodosContextType => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodosContext must be used within a TodosProvider');
  }

  return context;
};
