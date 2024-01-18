import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isActiveIds: number[],
  setIsActiveIds: React.Dispatch<React.SetStateAction<number[]>>,
  editMode: boolean,
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTodo: (todo: Todo | null) => void,
  selectedTodo: Todo | null,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => { },
  isLoading: false,
  setIsLoading: () => {},
  isActiveIds: [],
  setIsActiveIds: () => { },
  editMode: false,
  setEditMode: () => {},
  setSelectedTodo: () => { },
  selectedTodo: null,
  tempTodo: null,
  setTempTodo: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveIds, setIsActiveIds] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const value = {
    todos,
    setTodos,
    isLoading,
    setIsLoading,
    isActiveIds,
    setIsActiveIds,
    editMode,
    setEditMode,
    selectedTodo,
    setSelectedTodo,
    tempTodo,
    setTempTodo,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
