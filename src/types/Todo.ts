export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoContextType = {
  todo: Todo[];
  tempTodo: Todo | null;
  processingTodoIds: number[];
  isCreatingTodo: boolean;
  handleSelected: (id: number) => Promise<void>;
  handleRemove: (id: number) => Promise<boolean>;
  handleFilterAll: () => void;
  handleActive: () => void;
  handleCompleted: () => void;
  filteredTodo: Todo[];
  filter: string;
  handleCreateTodo: (title: string) => Promise<boolean>;
  handleRemoveCompleted: () => Promise<void>;
  handleUpdateTodo: (
    id: number,
    updates: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<boolean>;
  handleToggleAll: () => Promise<void>;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};
