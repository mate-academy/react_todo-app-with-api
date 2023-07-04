export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CommonTodosProps {
  removeTodos: (id: number[]) => void;
  loadingTodoIds: number[];
  handleToggleTodoStatus: (todoId: number[]) => void;
  changeTitle: (todoId: number, newTitle: string) => void;
}
