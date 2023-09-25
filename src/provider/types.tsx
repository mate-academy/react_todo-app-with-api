import React, { FormEvent } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export interface TodoContextType {
  todos: Todo[],
  error: Errors | null;
  filterTodos: FilterType;
  newTodoName: string;
  temptTodo: Todo | null;
  editedTodo: boolean;
  temptTodos: Todo[];
  allTodosAreActive: boolean;
  newTitle: string;
  setNewTodoName: React.Dispatch<React.SetStateAction<string>>;
  handleShowError: (err: Errors) => void;
  handleSetFilterTodos: (filterType: FilterType) => void;
  closeErrorMessage: () => void,
  addNewTodo: (event: FormEvent<HTMLFormElement>) => void;
  removeTask: (task: Todo) => void;
  deleteCompleted: (tasks: Todo[]) => void;
  toggleActiveTodo: () => void;
  toggleCompletedTodos: (task: Todo) => void;
  todoTitleEdition: (task: Todo, newTitle: string, tasks: Todo[]) => void;
  onTitleEdition: (tasks: Todo[], taskId: number) => void;
  closeTitleEdition: (tasks: Todo[], taskId: number) => void;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
}

export enum Errors {
  Download = 'Unable to load todos',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  Title = 'Title can\'t be empty',
}

export type Props = React.PropsWithChildren<{}>;
