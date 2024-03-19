export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
}

export interface ChangeTodo {
  id?: number;
  userId?: number;
  title?: string;
  completed?: boolean;
}

export interface AddingTodo {
  id?: number;
  userId?: number;
  title: string;
  completed: boolean;
}
