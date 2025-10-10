export interface Todo {
  id: number;
  name: string;
  email: string;
  userId: number;
  title: string;
  completed: boolean;
  isLoading?: boolean;
  loadingIds?: number[];
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
  setLoadingIds?: React.Dispatch<React.SetStateAction<number[]>>;
}
