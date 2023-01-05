import { FC } from 'react';
import { Filter } from './Filter';

interface Props {
  numberOfItems: number,
  filterStatus: string,
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>,
  onClearCompleted: () => void,
  isClearCompletedHidden: boolean,
}

export const Footer: FC<Props> = ({
  numberOfItems,
  filterStatus,
  setFilterStatus,
  onClearCompleted,
  isClearCompletedHidden,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${numberOfItems} items left`}
    </span>

    <Filter filterStatus={filterStatus} onFilter={setFilterStatus} />

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={onClearCompleted}
      style={{
        visibility: !isClearCompletedHidden ? 'hidden' : 'visible',
      }}
    >
      Clear completed
    </button>
  </footer>
);
