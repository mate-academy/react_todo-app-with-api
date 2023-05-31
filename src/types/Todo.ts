export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
}

export interface DataPatch {
  completed?: boolean,
  title?: string,
}

export interface NewTodo {
  title: string,
  userId: number,
  completed: boolean,
}

export interface TodoCompletedData {
  completed: boolean
}
