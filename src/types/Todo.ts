export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export type ItemProps = {
  todo: Todo;
  handleTodoStatusChange: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoIds: number[];
  updateTodo: (object: Todo) => void;
};

export type ListProps = {
  visibleTodos: Todo[];
  handleTodoStatusChange: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  updateTodo: (object: Todo) => void;
};
