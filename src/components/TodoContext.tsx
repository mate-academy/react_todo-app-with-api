import React, {
  useEffect,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Context } from '../types/Context';
import { Status } from '../types/Status';
import { ErrorType } from '../types/ErrorType';
import * as todosService from '../api/todos';

const USER_ID = 11941;

const initialState:Context = {
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  updateTodo: async () => {},
  filter: Status.All,
  setFilter: () => {},
  error: ErrorType.None,
  setError: () => {},
  todoIdsWithLoader: [],
  setTodoIdsWithLoader: () => {},
};

export const TodoContext = React.createContext<Context>(initialState);

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(Status.All);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [todoIdsWithLoader, setTodoIdsWithLoader] = useState<number[]>([]);

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.LoadError))
      .finally(() => setTimeout(() => {
        setError(ErrorType.None);
      }, 3000));
  }, []);

  const deleteTodo = (todoId: number) => {
    setError(ErrorType.None);
    setTodoIdsWithLoader(currentTodoIds => [...currentTodoIds, todoId]);

    return todosService.deleteTodo(todoId)
      .then(() => setTodos(
        prevTodos => prevTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => {
        setError(ErrorType.DeleteTodoError);
      })
      .finally(() => {
        setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);
        setTodoIdsWithLoader(
          prevTodoIds => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setError(ErrorType.None);

    setTempTodo({
      id: 0, userId, title, completed,
    });

    return todosService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch((err) => {
        setError(ErrorType.AddTodoError);
        throw err;
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setError(ErrorType.None);
    setTodoIdsWithLoader(
      currentTodoIds => [...currentTodoIds, updatedTodo.id],
    );

    return todosService.updateTodo(updatedTodo)
      .then(todo => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const index = newTodos
            .findIndex(todoItem => todoItem.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => setError(ErrorType.AddTodoError))
      .finally(() => {
        setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);
        setTodoIdsWithLoader(
          prevTodoIds => prevTodoIds.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const value = {
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    addTodo,
    deleteTodo,
    updateTodo,
    filter,
    setFilter,
    error,
    setError,
    todoIdsWithLoader,
    setTodoIdsWithLoader,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
