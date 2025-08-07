import { Todo } from './Todo';

export interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  loadingTodo: number | null;
  setError: (error: string | null) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, newStatus: boolean) => void;
  onRename: (id: number, newTitle: string) => Promise<boolean>;
}
