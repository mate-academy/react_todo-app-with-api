export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoUpdateData {
  title?: string,
  completed?: boolean;
}
