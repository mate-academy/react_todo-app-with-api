import { memo } from 'react';

import { Status } from '../types';
import { TodoCounter } from './TodoCounter';
import { TodoFilter } from './TodoFilter';
import { ClearCompletedButton } from './ClearCompletedButton';

type Props = {
  activeCount: number;
  hasCompleted: boolean;
  filterValue: Status;
  onFilterValueChange: (value: Status) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = memo(({
  activeCount,
  hasCompleted,
  filterValue,
  onFilterValueChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <TodoCounter value={activeCount} />

    <TodoFilter
      value={filterValue}
      onValueChange={onFilterValueChange}
    />

    <ClearCompletedButton
      active={hasCompleted}
      onClear={onClearCompleted}
    />
  </footer>
));
