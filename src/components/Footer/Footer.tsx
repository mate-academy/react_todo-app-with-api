import { Status } from '../../types/Status';
import { TodosFilter } from '../TodoFilter/TodoFilter';

type Props = {
  leftToComplete: number,
  filteredType: Status,
  setFilteredType: (status: Status) => void,
  showClearButton: boolean,
  handleDeleteCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  leftToComplete,
  filteredType,
  setFilteredType,
  showClearButton,
  handleDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftToComplete > 1 ? (
          `${leftToComplete} items left`
        ) : (
          `${leftToComplete} item left`
        )}
      </span>

      <TodosFilter
        filteredType={filteredType}
        setFilteredType={setFilteredType}
      />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!showClearButton}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
