import { Todo } from './Todo';

export interface TodoListProps {
  filteredTodos: Todo[];
  setError: (error: string | null) => void;
  tempTodo?: Todo | null;
  loadingTodo: number | null;
  onDelete: (id: number) => void;
  onToggle: (id: number, newStatus: boolean) => void;
  onRename: (id: number, newTitle: string) => Promise<boolean>;
}
