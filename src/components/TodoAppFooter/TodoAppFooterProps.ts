import { Todo } from '../../types/Todo';
import { StatusValue } from '../../types/StatusValue';

export interface TodoAppFooterProps {
  todos: Todo[];
  completedTodoIds: number[];
  todoFilter: StatusValue;
  setTodoFilter: React.Dispatch<React.SetStateAction<StatusValue>>;
  handleClearCompleted: () => void;
}
