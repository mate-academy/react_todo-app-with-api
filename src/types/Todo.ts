export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  loaderAfterEditing?: boolean;
  isOnTitleEdition?: boolean;
}
