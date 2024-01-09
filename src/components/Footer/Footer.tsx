import { FC } from 'react';
import { Filter } from '../Filter';
import { FilterBy } from '../../types/types';

type Props = {
  itemsCount: number;
  getFilter: (arg: FilterBy) => void;
  clearBtnOnClick: () => void;
  clearBtnDisabled: boolean;
};

export const Footer: FC<Props> = ({
  itemsCount,
  getFilter,
  clearBtnOnClick,
  clearBtnDisabled,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsCount} items left`}
      </span>

      <Filter getFilter={getFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearBtnOnClick}
        disabled={clearBtnDisabled}
      >
        Clear completed
      </button>
    </footer>
  );
};
