import { Todo } from './Todo';

export interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  handleTodoToggle: (todoId: number, completed: boolean) => void;
  handleTodoDelete: (todoId: number) => void;
  isLoading: Record<number, boolean>;
}
