import { memo, FC } from 'react';
import cn from 'classnames';

type ToggleAllButtonProps = {
  allCompleted: boolean;
  onToggleAll: () => void;
  isDisabled: boolean;
};

export const ToggleAllButton: FC<ToggleAllButtonProps> = memo(
  ({ allCompleted, onToggleAll, isDisabled = false }) => {
    return (
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        disabled={isDisabled}
        aria-pressed={allCompleted}
      />
    );
  },
);

ToggleAllButton.displayName = 'ToggleAllButton';
