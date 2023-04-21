import React, { ReactNode, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import {ErrorType, FilterType} from "../types/enums";

export interface Props {
  children: ReactNode
}

export interface ContextValue {
  todos: Todo[],
  setTodos: React.Dispatch<SetStateAction<Todo[]>>,
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>,
  setProcessingTodoIds: React.Dispatch<SetStateAction<Record<number, boolean>>>,
  completedTodos: Todo[],
  activeTodos: Todo[],
  errorMessage: ErrorType,
  setErrorMessage: React.Dispatch<SetStateAction<ErrorType>>,
  addProcessingTodo: (id: number) => void,
  removeProcessingTodo: (id: number) => void,
  isTodoProcessing: (id: number) => boolean,
  filterType: FilterType,
  setFilterType: React.Dispatch<SetStateAction<FilterType>>,
}
