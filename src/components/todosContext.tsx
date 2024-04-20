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
          setErrorMessage('Unable to update a todo');
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
      .catch(() => setErrorMessage('Unable to delete a todo'))
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
    }),
    [todos, setTodos, allId, errorMessage, isSubmiting, selectedFilter],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
