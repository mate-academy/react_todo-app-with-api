import { FilterOption } from './types';

export type HandleErrorMessageReceived = () => void;
export type HandleNewTodoInputChange = (title: string) => void;
export type HandleFilterChange = (filter: FilterOption) => void;
export type HandleCompletedChange = (id: number, completed: boolean) => void;
export type HandleTitleChange = (
  id: number,
  completed: string,
) => Promise<boolean>;
export type HandleTodoAdd = (title: string) => Promise<boolean>;
export type HandleTodoRemove = (id: number) => Promise<boolean>;
