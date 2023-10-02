import { useTodoFilter } from './useToDoFilter';
import { ToDoCounter } from './ToDoCounter';
import { TodoFilter } from './TodoFilter';
import { ClearCompleted } from './ClearCompleted';

export const ToDoFooter:React.FC = () => {
  const { active, showFooter } = useTodoFilter();

  return showFooter ? (
    <footer className="todoapp__footer" data-cy="Footer">
      <ToDoCounter active={active} />
      <TodoFilter />
      <ClearCompleted />
    </footer>
  ) : null;
};
