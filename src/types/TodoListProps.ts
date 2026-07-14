import { Todo } from "./Todo";

export interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  deleteId: number[];
  deleteData: (id: number) => Promise<boolean>;
  changeStatusData: (id: number) => void;
  renameData: (id: number, newTitle: string) => Promise<boolean>;
}
