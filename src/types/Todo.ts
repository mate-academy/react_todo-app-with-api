export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type PartialTodo = {
  completed?: Todo['completed'];
  title?: Todo['title'];
  id: Todo['id'];
};
