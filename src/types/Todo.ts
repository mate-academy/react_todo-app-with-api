export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface AddedTodo {
  id?: number;
  userId: number;
  title: string;
  completed: boolean;
}

// export type Fetch = (id: number) => Promise<Todo[]>;
