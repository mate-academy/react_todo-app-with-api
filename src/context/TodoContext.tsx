import React, {
  createContext,
  useMemo,
  useState,
} from 'react';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';
import { getActiveTodos, getCompletedTodos } from '../utils/getTodos';

interface Props {
  children: React.ReactNode
}

interface TodoContextInterface {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  errorMessage: ErrorMessage,
  setErrorMessage: (error: ErrorMessage) => void,
  addTodoHandler: (newTodo: Omit<Todo, 'id'>) => Promise<void>,
  completedTodos: Todo[],
  activeTodos: Todo[],
  deleteTodoHandler: (id: number) => void;
  clearCompleted: () => void;
  todosIdToDelete: number[],
  setTodosIdToDelete: (todoIdsToDelete: number[]) => void,

  toggleChangeHandler: (todo: Todo) => void,
  renameTodoHandler: (todo: Todo, newTodoTitle: string) => Promise<void>,
}

const initalContext: TodoContextInterface = {
  todos: [],
  setTodos: () => {},
  isLoading: false,
  setIsLoading: () => {},
  errorMessage: ErrorMessage.Default,
  setErrorMessage: () => {},
  addTodoHandler: async () => {},
  completedTodos: [],
  activeTodos: [],
  deleteTodoHandler: () => {},
  clearCompleted: () => {},
  todosIdToDelete: [],
  setTodosIdToDelete: () => {},

  toggleChangeHandler: async () => {},
  renameTodoHandler: async () => {},
};

export const TodoContext = createContext(initalContext);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [isLoading, setIsLoading] = useState(false);
  const [todosIdToDelete, setTodosIdToDelete] = useState<number[]>([]);

  const completedTodos = getCompletedTodos(todos);
  const activeTodos = getActiveTodos(todos);

  const addTodoHandler = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    return todoService.addTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddError);
        throw new Error();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteTodoHandler = (todoId: number) => {
    setIsLoading(true);
    setTodosIdToDelete(prevState => [...prevState, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteError);
        throw new Error(ErrorMessage.DeleteError);
      })
      .finally(() => {
        setTodosIdToDelete(
          (prevState) => prevState.filter(id => id !== todoId),
        );
        setIsLoading(false);
      });
  };

  const clearCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodoHandler(id));
  };

  const renameTodoHandler = (todo: Todo, newTodoTitle: string) => {
    if (todo.title === newTodoTitle) {
      return Promise.resolve();
    }

    setIsLoading(true);

    // eslint-disable-next-line consistent-return
    return todoService
      .updateTodo({
        ...todo,
        title: newTodoTitle,
      })
      .then((updatedTodo) => {
        setTodos(prevState => prevState.map(currTodo => {
          return currTodo.id !== updatedTodo.id
            ? currTodo
            : updatedTodo;
        }));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateError);
        throw new Error(ErrorMessage.UpdateError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleChangeHandler = (todo: Todo) => {
    setIsLoading(true);

    todoService.updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currTodo => (
            currTodo.id === updatedTodo.id
              ? updatedTodo
              : currTodo
          )));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateError);
        throw new Error(ErrorMessage.UpdateError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const value = useMemo(() => ({
    todos,
    setTodos,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    addTodoHandler,
    completedTodos,
    activeTodos,
    deleteTodoHandler,
    clearCompleted,
    todosIdToDelete,
    setTodosIdToDelete,
    renameTodoHandler,
    toggleChangeHandler,
  }), [todos, errorMessage, isLoading]);

  return (
    <TodoContext.Provider
      value={value}
    >
      {children}
    </TodoContext.Provider>
  );
};
