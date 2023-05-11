import { FILTERS } from '../../constants/filters';
import { ClearButton } from './ClearButton';
import { Filter } from './Filter';
import { TodoCount } from './TodoCount';

interface Props {
  count: number;
  onSetActiveFilter: React.Dispatch<React.SetStateAction<FILTERS>>;
  isCompletedExist: boolean;
  onDelete: () => Promise<void>;
}

export const Footer: React.FC<Props> = ({
  count,
  onSetActiveFilter,
  isCompletedExist,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer">
      <TodoCount count={count} />
      <Filter onSetActiveFilter={onSetActiveFilter} />
      <ClearButton
        isCompletedExist={isCompletedExist}
        onDelete={onDelete}
      />
    </footer>
  );
};
