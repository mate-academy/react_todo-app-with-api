import { Todo } from './Todo';

export interface TodoItemProps {
  todo: Todo;
  isUpdatingAll: boolean;
  loadingTodo: number | null;
  editingId: number | null;
  editText: string;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  handleEdit: (todoId: number, newTitle: string) => void;
  toggleTodoStatus: (todoId: number) => void;
  deleteTodo: (todoId: number) => void;
}
