import { Todo } from '../../types/Todo';

export type Props = {
  filterType: string;
  handleFilterType: (type: string) => void;
  todos: Todo[];
  deleteCompleted: () => void;
};
