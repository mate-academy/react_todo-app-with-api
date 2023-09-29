import cn from 'classnames';
import { useToggleAll } from './useToggleAll';

export const ToggleAllButton:React.FC = () => {
  const { isVisible, toggleAll, active } = useToggleAll();

  if (!isVisible) {
    return <></>;
  }

  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active,
      })}
      data-cy="ToggleAllButton"
      aria-label="Toggle all todos!"
      onClick={toggleAll}
    />
  );
};
