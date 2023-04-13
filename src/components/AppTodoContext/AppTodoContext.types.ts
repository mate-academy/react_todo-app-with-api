import React, { ReactNode, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../Error/Error.types';

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
  processingTodoIDs: number[],
  setProcessingTodoIDs: React.Dispatch<SetStateAction<number[]>>,
  completedTodos: Todo[],
  uncompletedTodos: Todo[],
  errorMessage: ErrorType,
  setErrorMessage: React.Dispatch<SetStateAction<ErrorType>>
}
