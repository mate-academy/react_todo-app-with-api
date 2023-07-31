/* eslint-disable max-len */
import React, {
  ReactNode, useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';

export const USER_ID = 11120;

export enum StateOption {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export enum ErrorOption {
  FetchErr = 'Unable to upload todos',
  TitleErr = 'Title can not be empty',
  AddError = 'Unable to add a todo',
  DeleteError = 'Unable to delete a todo',
  UpdateError = 'Unable to update a todo',
}

type Props = {
  children: ReactNode;
};

interface ContextValues {
  todos: Todo[],
  selectedTodo: Todo | null,
  visibleTodos: Todo[],
  activeTodosAmount: number,
  error: string | null,
  filter: string,
  loading: boolean,
  todoInCreation: Todo | null,
  setTodoInCreation: React.Dispatch<React.SetStateAction<Todo | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setError: React.Dispatch<React.SetStateAction<ErrorOption | null>>,
  setFilter: React.Dispatch<React.SetStateAction<StateOption>>,
  deleteTodo: (todoId: number) => void,
  addTodo: (todoTitle: string) => Promise<boolean>,
  handleClearCompleted: () => void,
  handleUpdateTodo: (todo: Todo) => void,
  toggleStatus: () => void,
}

export const TodoContext = React.createContext({} as ContextValues);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoInCreation, setTodoInCreation] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<StateOption>(StateOption.all);
  const [error, setError] = useState<ErrorOption | null>(null);

  useEffect(() => {
    setError(null);

    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorOption.FetchErr));
  }, []);

  const filterTodos = (
    array: Todo[], selectedFilterOption: StateOption,
  ) => {
    const filteredArray = array.filter(todo => {
      switch (selectedFilterOption) {
        case StateOption.active:
          return !todo.completed;
        case StateOption.completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    return filteredArray;
  };

  const addTodo = useCallback((todoTitle: string) => {
    const newTodo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setLoading(true);
    setTodoInCreation(newTodo);
    setError(null);

    return todosService.postTodo(newTodo)
      .then(todo => {
        setTodos(curTodos => [...curTodos, todo]);
        setError(null);

        return true;
      })
      .catch(() => {
        setError(ErrorOption.AddError);

        return false;
      })
      .finally(() => {
        setLoading(false);
        setTodoInCreation(null);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setLoading(true);
    setError(null);

    todosService.deleteTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId)))
      .catch(() => setError(ErrorOption.DeleteError))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateTodo = useCallback((todoToUpdate: Todo) => {
    setLoading(true);
    setError(null);

    todosService.updateTodo(todoToUpdate)
      .then(() => setTodos(currentTodos => currentTodos.map(todo => (todo.id === todoToUpdate.id ? todoToUpdate : todo))))
      .catch(() => setError(ErrorOption.UpdateError))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = useCallback(() => {
    todos.map(todo => handleUpdateTodo({
      ...todo,
      completed: !todo.completed,
    }));
  }, [todos]);

  const handleClearCompleted = useCallback(() => {
    todos.map(todo => (todo.completed ? deleteTodo(todo.id) : todo));
  }, [todos]);

  const visibleTodos: Todo[] = useMemo(() => filterTodos(todos, filter),
    [todos, filter]);

  const activeTodosAmount = useMemo(() => todos.filter(todo => !todo.completed).length,
    [todos]);

  const contextValues: ContextValues = useMemo(() => ({
    todos,
    visibleTodos,
    activeTodosAmount,
    error,
    setError,
    filter,
    loading,
    todoInCreation,
    setTodoInCreation,
    setLoading,
    setFilter,
    selectedTodo,
    setSelectedTodo,
    deleteTodo,
    addTodo,
    handleClearCompleted,
    handleUpdateTodo,
    toggleStatus,
  }), [
    todos,
    loading,
    todoInCreation,
    visibleTodos,
    selectedTodo,
    activeTodosAmount,
    error,
    filter,
  ]);

  return (
    <TodoContext.Provider value={contextValues}>
      {children}
    </TodoContext.Provider>
  );
};
