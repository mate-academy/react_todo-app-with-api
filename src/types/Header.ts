export type Props = {
  todosLength: number,
  handleCreateTodo: (
    event: React.FormEvent,
    todoTitle: string,
    setIsInputDisabled: (value: boolean) => void,
    setTodoTitle: (value: string) => void,
  ) => void;
  handleToggleAll: () => void;
  isAllTodoCompleted: boolean;
  focusToHeaderInput: boolean;
};
