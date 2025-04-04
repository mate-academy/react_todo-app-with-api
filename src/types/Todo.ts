export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdateDataProps = {
  id: number;
} & Partial<Pick<Todo, 'title' | 'completed'>>;

export type TitleType = {
  event: React.FormEvent;
  id: number;
  setIsEditing: (value: boolean) => void;
  newTitle: string;
};
