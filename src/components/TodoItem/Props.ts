import { Todo } from '../../types/Todo';

export interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  onToggle?: (todo: Todo) => void;
  onRename?: (todo: Todo) => void;
  isLoading: boolean;
}
