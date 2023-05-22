export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoToSend {
  userId: number,
  title: string,
  completed: boolean,
}
