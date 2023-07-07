export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CommonTodosProps {
  removeTodos: (id: number[]) => void;
  loadingTodoIds: number[];
  handleUpdate: (todoId: number[], newTitle?: string) => void;
}
