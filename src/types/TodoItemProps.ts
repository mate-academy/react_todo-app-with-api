import { Todo } from '../types/Todo';

export interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  isDeleteDisabled?: boolean;
  onToggle?: (id: number) => void;
  isEditing?: boolean;
  onStartEdit?: (todoId: number) => void;
  onCancelEdit?: () => void;
  onSubmitTitle?: (todoId: number, title: string) => Promise<void> | void;
}
