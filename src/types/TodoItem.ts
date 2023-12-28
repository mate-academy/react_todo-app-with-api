import { Todo } from './Todo';

export type Props = {
  todo: Todo,
  isLoading: boolean,
  handleDeleteTodo?: (id: number) => Promise<void>,
  handleCompleteTodo?: (
    id: number,
    completed: boolean,
  ) => Promise<void>,
  handleChangeTodoTitle?: (
    id: number,
    newTitle: string,
  ) => Promise<void>,
};
