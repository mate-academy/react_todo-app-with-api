export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type CreateTodoFragment = {
  userId: number;
  title: string;
  completed: boolean;
};

export interface UpdateStatus {
  completed: boolean;
}

export interface UpdateTitle {
  title: string;
}

export interface ErrorType {
  title: string;
  message: string;
}
