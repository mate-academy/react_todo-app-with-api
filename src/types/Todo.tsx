export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CommonTodosProps {
  removesTodo: (id: number[]) => void;
  loadingTodos: number[];
  onTooglingTodo: (todoId: number, toggleAll?: boolean) => void;
  changeTitle: (todoId: number, newTitle: string) => void;
}
