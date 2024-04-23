/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { FilterStatuses } from '../data/enums';
import { Todo } from '../types/Todo';

type TodosContextType = {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  handleDeleteTodo: (pressedId: number) => void;
  allId: number[];
  setAllId: (allId: number[]) => void;
  errorMessage: string;
  setErrorMessage(errorMessage: string): void;
  isSubmiting: boolean;
  setIsSubmiting(isSubmiting: boolean): void;
  selectedFilter: FilterStatuses;
  setSelectedFilter(selectedFilter: FilterStatuses): void;
  handleUpdateTodoStatus: (updetedTodo: Todo) => void;
  updatedValue: string;
  setUpdatedValue: (updatedValue: string) => void;
  handleUpdateTodoTitle: (updatedTodo: Todo) => Promise<void>;
  tempEdition: Todo | null;
  setTempEdition: (tempEdition: Todo | null) => void;
  UNAIBLE_TO_UPDATE: string;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  handleDeleteTodo: (_pressedId: number) => {},
  allId: [],
  setAllId: (_allId: number[]) => {},
  errorMessage: '',
  setErrorMessage: (_errorMessage: string) => {},
  isSubmiting: false,
  setIsSubmiting: (_isSubmiting: boolean) => {},
  selectedFilter: FilterStatuses.All,
  setSelectedFilter: (_selectedFilter: FilterStatuses) => {},
  handleUpdateTodoStatus: (_updetedTodo: Todo) => {},
  updatedValue: '',
  setUpdatedValue: (_updatedValue: string) => {},
  handleUpdateTodoTitle: async (_updetedTodo: Todo) => {},
  tempEdition: null,
  setTempEdition: (_tempEdition: Todo | null) => {},
  UNAIBLE_TO_UPDATE: 'Unable to update a todo',
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allId, setAllId] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterStatuses.All);
  const [updatedValue, setUpdatedValue] = useState('');
  const [tempEdition, setTempEdition] = useState<Todo | null>(null);

  const UNAIBLE_TO_UPDATE = 'Unable to update a todo';
  const UNAIBLE_TO_DELETE = 'Unable to delete a todo';

  const handleUpdateTodoTitle = (clickedTodo: Todo) => {
    const updatedTodo = {
      ...clickedTodo,
      title: updatedValue.trim(),
    };

    setAllId(prevAllId => [...prevAllId, updatedTodo.id]);

    setTempEdition(updatedTodo);

    return updateTodo(updatedTodo)
      .then(response => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];

          const index = newTodos.findIndex(todo => todo.id === response.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })

      .finally(() => {
        setAllId([]);
        setTempEdition(null);
      });
  };

  const handleUpdateTodoStatus = (clickedTodo: Todo) => {
    const updatedTodo = {
      ...clickedTodo,
      completed: !clickedTodo.completed,
    };

    setAllId(prevAllId => [...prevAllId, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(response => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];

          const index = newTodos.findIndex(todo => todo.id === response.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setTimeout(() => {
          setErrorMessage(UNAIBLE_TO_UPDATE);
        }, 3000);
      })
      .finally(() => {
        setAllId([]);
      });
  };

  const handleDeleteTodo = (pressedId: number) => {
    setAllId(prevAllId => [...prevAllId, pressedId]);

    setIsSubmiting(true);

    deleteTodo(pressedId)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== pressedId)),
      )
      .catch(() => setErrorMessage(UNAIBLE_TO_DELETE))
      .finally(() => {
        setIsSubmiting(false);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      handleDeleteTodo,
      allId,
      setAllId,
      errorMessage,
      setErrorMessage,
      isSubmiting,
      setIsSubmiting,
      selectedFilter,
      setSelectedFilter,
      handleUpdateTodoStatus,
      updatedValue,
      setUpdatedValue,
      handleUpdateTodoTitle,
      tempEdition,
      setTempEdition,
      UNAIBLE_TO_UPDATE,
    }),
    [
      todos,
      allId,
      errorMessage,
      isSubmiting,
      selectedFilter,
      updatedValue,
      tempEdition,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
