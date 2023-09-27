import { memo } from 'react';

type Props = {
  active: boolean;
  onClear: () => void;
};

export const ClearCompletedButton: React.FC<Props> = memo(({
  active,
  onClear,
}) => (
  <button
    type="button"
    data-cy="ClearCompletedButton"
    className="todoapp__clear-completed"
    disabled={!active}
    onClick={onClear}
  >
    Clear completed
  </button>
));
