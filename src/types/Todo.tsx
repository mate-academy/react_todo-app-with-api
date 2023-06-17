export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CommonTodosProps {
  removesTodo: (id: number[]) => void;
  loadingTodos: number[];
  onChangeTodo: (
    todoId: number,
    key: keyof Omit<Todo, 'id' | 'userId'>,
    valueOfKey: boolean[] | string,
  ) => void;
}
