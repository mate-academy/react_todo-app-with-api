import cn from 'classnames';

type ToggleAllButtonProps = {
  allCompleted: boolean;
  onToggleAll: () => Promise<void>;
};

export const ToggleAllButton = ({
  allCompleted,
  onToggleAll,
}: ToggleAllButtonProps) => {
  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: allCompleted,
      })}
      data-cy="ToggleAllButton"
      onClick={() => onToggleAll()}
    />
  );
};
