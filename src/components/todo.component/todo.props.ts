import { Todo } from '../todo.component/todo.types';

export interface TodoProps {
  todo: Todo;
  isTemp?: boolean;
  onTodoChange: (updatedTodo: Partial<Todo> & { id: number }) => void;
  onDeleteTodo: (deletedTodoId: number) => void;
  onError: (errorMessage: string) => void;
  isExternalLoading: boolean;
}
