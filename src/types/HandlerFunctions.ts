import { FilterStatus } from './FilterStatus';
import { Todo } from './Todo';

//eslint-disable-next-line
export type HandleCreateTodo = ({
  title,
  userId,
  completed,
}: Omit<Todo, 'id'>) => Promise<boolean>;
export type HandleDeleteTodo = (todoId: number) => Promise<boolean>;
export type HandleUpdateTodo = (todo: Todo) => Promise<boolean>;

export type HandleErrorMessageSend = (errorMessage: string) => void;
export type HandleErrorMessageClear = () => void;
export type HandleToggleComplete = (todo: Todo) => void;
export type HandleToggleAllComplete = (updatedTodos: Todo[]) => void;
export type HandleChangeFilterStatus = (status: FilterStatus) => void;
