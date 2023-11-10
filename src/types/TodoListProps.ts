import { Todo } from './Todo';

export interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
  isSubmitting: boolean;
  loadingTodo: number | null;
  toggleTodoStatus: (todoId: number) => void;
}
