import { Todo } from './Todo';

export interface EditingItem {
  selectedTodo: Todo | null;
  editedTitle: string;
}
