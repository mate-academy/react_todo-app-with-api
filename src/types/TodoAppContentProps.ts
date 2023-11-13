import { Dispatch, RefObject, SetStateAction } from 'react';
import { FilterBy } from './FilterBy';
import { Todo } from './Todo';

export interface TodoAppContentProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  todos: Todo[];
  filterBy: FilterBy;
  todoInput: string;
  isSubmitting: boolean;
  handleAddTodo: (event: React.FormEvent) => void;
  setTodoInput: Dispatch<SetStateAction<string>>;
  deleteTodo: (todoId: number) => void;
  handleFilterClick:
  (filterType: FilterBy) => (event: React.MouseEvent) => void;
  clearCompletedTodos: () => void;
  focusRef: RefObject<HTMLInputElement>;
  loadingTodo: number | null;
  toggleTodoStatus: (todoId: number) => void;
  toggleAllTodos: () => void;
  isUpdatingAll: boolean;
  editingId: number | null;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  editText: string;
  setEditText: Dispatch<SetStateAction<string>>;
  handleEdit: (todoId: number, newTitle: string) => void;
}
