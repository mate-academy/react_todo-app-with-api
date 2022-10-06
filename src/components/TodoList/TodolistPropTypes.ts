import { Todo } from '../../types/Todo';

export type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  loadingTodoId: number | null;
  toggleStatus: (todoId: number, completed: boolean) => void;
  setloadingTodoId: (todoId: number | null) => void;
  setErrorMessage: (message: string) => void;
  changeTitle: (todoId: number, newTitle : string) => void;
};
