import { Dispatch, SetStateAction } from 'react';
import { Progress } from '../../types/Progress';
import { Todo } from '../../types/Todo';

interface Props {
  itemsLeft: number,
  setProgress: (type: Progress) => void;
  isAnyCompleted: boolean,
  todos: Todo[],
  onClear: (todoId: number) => void,
  setLoadingIds:Dispatch<SetStateAction<number[]>>
}

export const Footer:React.FC<Props> = ({
  itemsLeft,
  setProgress,
  isAnyCompleted,
  todos,
  onClear,
  setLoadingIds,
}) => {
  const ClearAllCompleted = async () => {
    setLoadingIds((
    ) => todos.filter(todo => todo.completed).map(todo => todo.id));

    try {
      await Promise.all(
        todos
          .filter(todo => todo.completed)
          .map(async todo => {
            await onClear(todo.id);
          }),
      );
    } finally {
      setLoadingIds([]);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className="filter__link selected"
          data-cy="FilterLinkAll"
          onClick={() => setProgress(Progress.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className="filter__link"
          data-cy="FilterLinkActive"
          onClick={() => setProgress(Progress.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className="filter__link"
          data-cy="FilterLinkCompleted"
          onClick={() => setProgress(Progress.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompleted}
        onClick={ClearAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
