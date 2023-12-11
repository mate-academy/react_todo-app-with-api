import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from 'react';

import * as todoService from '../api/todos';

import { Error } from '../types/Error';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface TodosContextType {
  USER_ID: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo) => void,
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>,
  deleteTodo: (todoId: number) => void,
  updateTodo: (updatedTodo: Todo) => void | Promise<Todo> | Promise<void>,
  isAdding: boolean,
  setIsAdding: (value: boolean) => void,
  idsToLoading: number[],
  setIdsToLoading: (value: number[]) => void,
  todoFilter: Status,
  setTodoFilter: (todoFilter: Status) => void,
  filteredTodos: Todo[],
  todoError: null | Error,
  setTodoError: (todoError: Error | null) => void,
  handleToggleAll: () => void,
}

const initialTodosContext: TodosContextType = {
  USER_ID: 12002,
  todos: [],
  setTodos: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  addTodo: async () => { },
  deleteTodo: async () => { },
  updateTodo: async () => { },
  isAdding: false,
  setIsAdding: () => { },
  idsToLoading: [],
  setIdsToLoading: () => { },
  todoFilter: Status.All,
  setTodoFilter: () => { },
  filteredTodos: [],
  todoError: null,
  setTodoError: () => { },
  handleToggleAll: () => { },
};

export const TodosContext = React.createContext<TodosContextType>(
  initialTodosContext,
);

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12002;

export const useTodosContext = () => useContext(TodosContext);

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoFilter, setTodoFilter] = useState<Status>(Status.All);
  const [todoError, setTodoError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [idsToLoading, setIdsToLoading] = useState<number[]>([]);

  const addTodo = useCallback(
    ({ title, userId, completed }: Omit<Todo, 'id'>) => {
      setTodoError(null);

      setTempTodo({
        id: 0,
        title,
        userId,
        completed,
      });

      setIsAdding(true);

      return todoService.createTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch((error) => {
          setTodoError(Error.AddTodo);
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
          setIsAdding(false);
        });
    }, [],
  );

  const deleteTodo = useCallback((todoId: number) => {
    setTodoError(null);
    setIdsToLoading(prevIds => [...prevIds, todoId]);

    setTimeout(() => {
      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoId)
      ));

      return (
        todoService.deleteTodo(todoId))
        .then(() => {
          setIdsToLoading([]);
        })
        .catch((error) => {
          setTodos(todos);
          setTodoError(Error.DeleteTodo);
          setIdsToLoading(prevIds => [...prevIds]
            .filter(prevId => prevId !== todoId));

          throw error;
        });
    }, 300);
  }, [todos]);

  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      setTodoError(null);
      setIdsToLoading(prevIds => [...prevIds, updatedTodo.id]);

      setTimeout(() => {
        setTodos(currentTodos => (
          currentTodos.map(todo => (
            todo.id !== updatedTodo.id
              ? todo
              : updatedTodo
          ))
        ));

        return todoService.updateTodo(updatedTodo)
          .catch((error) => {
            setTodoError(Error.UpdateTodo);
            throw error;
          })
          .finally(() => {
            setIdsToLoading(prevIds => [...prevIds]
              .filter(prevId => prevId !== updatedTodo.id));
          });
      }, 300);
    }, [],
  );

  const handleToggleAll = useCallback(() => {
    const isEveryTodoCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isEveryTodoCompleted
      ? todo.completed
      : !todo.completed
    ));

    todosToUpdate.forEach((todo): void => {
      setIdsToLoading(prevIds => [...prevIds, todo.id]);

      updateTodo({ ...todo, completed: !isEveryTodoCompleted });
    });

    setIsAdding(false);
  }, [todos, updateTodo]);

  const filteredTodos = useMemo(() => {
    switch (todoFilter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todoFilter, todos]);

  useEffect(() => {
    setTodoError(null);

    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setTodoError(Error.LoadTodos));
  }, []);

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    addTodo,
    deleteTodo,
    updateTodo,
    isAdding,
    setIsAdding,
    idsToLoading,
    setIdsToLoading,
    todoFilter,
    setTodoFilter,
    filteredTodos,
    todoError,
    setTodoError,
    handleToggleAll,
  }), [
    addTodo, deleteTodo, updateTodo, filteredTodos, isAdding,
    tempTodo, todoError, todoFilter, todos, idsToLoading, handleToggleAll,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
