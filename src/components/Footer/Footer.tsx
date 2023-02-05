import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter/Filter';

type Props = {
  filterType: string,
  todosLeft: Todo[],
  todosCompleted: number,
  handleButtonClickAll: () => void,
  handleButtonClickActive: () => void,
  handleButtonClickCompleted: () => void,
  clearCompleated: () => void,

};

export const Footer: React.FC<Props> = memo(({
  filterType,
  todosLeft,
  todosCompleted,
  handleButtonClickAll,
  handleButtonClickActive,
  handleButtonClickCompleted,
  clearCompleated,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft.length} items left`}
      </span>

      <Filter
        filterType={filterType}
        handleButtonClickAll={handleButtonClickAll}
        handleButtonClickActive={handleButtonClickActive}
        handleButtonClickCompleted={handleButtonClickCompleted}
      />

      {todosCompleted !== 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleated}
          disabled={!todosCompleted}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
});
