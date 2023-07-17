import React from 'react';
import { Todo } from './Todo';

export type CreateTodoArgs = Omit<Todo, 'id'>;
export type UpdateTodoData = Partial<Omit<Todo, 'id' | 'userId'>>;

export enum Filter {
  All = '',
  Active = 'Active',
  Completed = 'Completed',
}

export type EventType = React.ChangeEvent<HTMLInputElement>;
