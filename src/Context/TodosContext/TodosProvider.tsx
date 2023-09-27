import React, {
  createContext, useState, useReducer,
} from 'react';

import { TodosListType, Todo } from '../../types/todosTypes';
import { FiltersType } from '../../types/filterTypes';
import { Actions } from '../../types/actionTypes';
import { todosReducer } from './TodosReducer';

type TodosContextType = {
  todos: TodosListType,
  dispatch: React.Dispatch<Actions>,
  filter: FiltersType,
  setFilter: React.Dispatch<React.SetStateAction<FiltersType>>
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
};

type Props = {
  children: React.ReactNode,
};

export const TodosContext = createContext<TodosContextType>({
  todos: [],
  dispatch: () => null,
  filter: FiltersType.ALL,
  setFilter: () => { },
  tempTodo: null,
  setTempTodo: () => null,
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(
    todosReducer,
    [],
  );
  const [filter, setFilter] = useState<FiltersType>(FiltersType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosContextValue = {
    todos,
    dispatch,
    filter,
    setFilter,
    tempTodo,
    setTempTodo,
  };

  return (
    <TodosContext.Provider value={todosContextValue}>
      {children}
    </TodosContext.Provider>
  );
};
