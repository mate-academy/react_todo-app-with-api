import { Todo } from '../types/Todo';
import { FilterParams } from '../utils/filterTodos';
import { Button } from './Button';
import { Nav } from './Nav';

type Props = {
  activeCount: number;
  selected: FilterParams;
  selectTodoFilter: (filter: FilterParams) => void;
  clearCompleted: () => void;
  todos: Todo[];
  setShouldFocusInput: (value: boolean) => void;
};
export const Footer: React.FC<Props> = ({
  activeCount,
  selected,
  selectTodoFilter,
  clearCompleted,
  todos,
  setShouldFocusInput,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>
      <Nav selected={selected} selectTodoFilter={selectTodoFilter} />
      <Button
        disabled={activeCount === todos.length}
        type="button"
        className="todoapp__clear-completed"
        dataCy="ClearCompletedButton"
        onClick={() => {
          setShouldFocusInput(true);
          clearCompleted();
        }}
      >
        Clear completed
      </Button>
    </footer>
  );
};
