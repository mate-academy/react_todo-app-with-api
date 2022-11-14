import { FC } from 'react';
import cn from 'classnames';

type Props = {
  setTodosCompleted: () => Promise<void>;
  isToggleVisible: boolean;
};

export const ToggleTodosCompleted: FC<Props> = ({
  setTodosCompleted,
  isToggleVisible,
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      data-cy="ToggleAllButton"
      type="button"
      className={cn('todoapp__toggle-all', {
        active: isToggleVisible,
      })}
      onClick={setTodosCompleted}
    />
  );
};
