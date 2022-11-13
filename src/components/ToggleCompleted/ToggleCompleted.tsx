import { FC } from 'react';
import cn from 'classnames';

type Props = {
  toggleAllCompleted: () => Promise<void>;
  isActive: boolean;
};

export const ToggleCompleted: FC<Props> = ({
  toggleAllCompleted,
  isActive,
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      data-cy="ToggleAllButton"
      type="button"
      className={cn('todoapp__toggle-all', {
        active: isActive,
      })}
      onClick={toggleAllCompleted}
    />
  );
};
