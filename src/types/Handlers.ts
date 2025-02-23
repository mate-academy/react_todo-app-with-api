import { Todo } from './Todo';

export type Handlers = {
  handleUpdate: (todo: Todo, completedStatus: boolean, title: string) => void;
  handleDelete: (todo: Todo) => void;
};
