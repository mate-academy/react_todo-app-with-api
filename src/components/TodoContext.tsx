import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Context } from '../types/Context';
import { Filter } from '../types/Filter';
import { ErrorTypes } from '../types/ErrorTypes';
import * as todosService from '../api/todos';
import { USER_ID } from '../utils/userId';

const State: Context = {
  tempTodo: null,
  setTempTodo: () => {},
  todos: [],
  setTodos: () => {},
  filter: Filter.ALL,
  setFilter: () => {},
  ErrorType: ErrorTypes.None,
  setErrorType: () => {},
  todoWithLoader: [],
  setTodoWithLoader: () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  updateTodo: async () => {},
};

export const TodoContext = React.createContext<Context>(State);

type Props = {
  children: React.ReactNode,
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [ErrorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.None);
  const [todoWithLoader, setTodoWithLoader] = useState<number[]>([]);

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch((err) => {
        setErrorType(ErrorTypes.LoadError);
        setTimeout(() => {
          setErrorType(ErrorTypes.None);
        }, 3000);
        throw err;
      });
  }, []);

  const deleteTodo = (todoId: number) => {
    setTodoWithLoader(currentTodoIds => [...currentTodoIds, todoId]);

    return todosService.deleteTodo(todoId)
      .then(() => setTodos(
        prevTodos => prevTodos.filter(todo => todo.id !== todoId),
      ))
      .catch((err) => {
        setErrorType(ErrorTypes.DeleteTodoError);
        setTimeout(() => {
          setErrorType(ErrorTypes.None);
        }, 3000);
        throw err;
      })
      .finally(() => {
        setTodoWithLoader(
          prevTodoIds => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setTempTodo({
      id: 0, userId, title, completed,
    });

    return todosService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch((err) => {
        setErrorType(ErrorTypes.AddTodoError);
        setTimeout(() => {
          setErrorType(ErrorTypes.None);
        }, 3000);
        throw err;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodoWithLoader(
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
      .catch((err) => {
        setErrorType(ErrorTypes.UpdateTodoError);
        setTimeout(() => {
          setErrorType(ErrorTypes.None);
        }, 3000);
        throw err;
      })
      .finally(() => {
        setTodoWithLoader(
          prevTodoIds => prevTodoIds.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const value = {
    tempTodo,
    setTempTodo,
    todos,
    setTodos,
    filter,
    setFilter,
    ErrorType,
    setErrorType,
    todoWithLoader,
    setTodoWithLoader,
    addTodo,
    deleteTodo,
    updateTodo,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
