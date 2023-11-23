import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';

export interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
  isSubmitting: boolean;
  loadingTodo: number | null;
  toggleTodoStatus: (todoId: number) => void;
  isUpdatingAll: boolean;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  todos: Todo[];
  editingId: number | null;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  editText: string;
  setEditText: Dispatch<SetStateAction<string>>;
  handleEdit: (todoId: number, newTitle: string) => void;
}
