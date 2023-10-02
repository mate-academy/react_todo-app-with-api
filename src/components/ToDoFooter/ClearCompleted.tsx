import { useTodoFilter } from './useToDoFilter';

export const ClearCompleted:React.FC = () => {
  const { buttonIsDisabled, clearCompleted } = useTodoFilter();

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={buttonIsDisabled}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  );
};
