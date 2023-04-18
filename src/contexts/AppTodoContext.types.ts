import React, { ReactNode, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../components/Error/Error.types';

export interface Props {
  children: ReactNode
}

export interface Value {
  todos: Todo[],
  setTodos: React.Dispatch<SetStateAction<Todo[]>>,
  visibleTodos: Todo[],
  setVisibleTodos: React.Dispatch<SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>,
  setProcessingTodoIds: React.Dispatch<SetStateAction<Record<number, boolean>>>,
  completedTodos: Todo[],
  uncompletedTodos: Todo[],
  errorMessage: ErrorType,
  setErrorMessage: React.Dispatch<SetStateAction<ErrorType>>
  addProcessingTodo: (id: number) => void,
  removeProcessingTodo: (id: number) => void,
  isTodoProcessing: (id: number) => boolean,
}
