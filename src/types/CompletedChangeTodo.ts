export interface CompletedChangeTodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  completedChanged?: boolean;
}
