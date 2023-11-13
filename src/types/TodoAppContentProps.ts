import { RefObject } from 'react';
import { FilterBy } from './FilterBy';
import { Todo } from './Todo';

export interface TodoAppContentProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  todos: Todo[];
  filterBy: FilterBy;
  todoInput: string;
  isSubmitting: boolean;
  handleAddTodo: (event: React.FormEvent) => void;
  setTodoInput: React.Dispatch<React.SetStateAction<string>>;
  deleteTodo: (todoId: number) => void;
  handleFilterClick:
  (filterType: FilterBy) => (event: React.MouseEvent) => void;
  clearCompletedTodos: () => void;
  focusRef: RefObject<HTMLInputElement>;
  loadingTodo: number | null;
  toggleTodoStatus: (todoId: number) => void;
  toggleAllTodos: () => void;
  isUpdatingAll: boolean;
}
