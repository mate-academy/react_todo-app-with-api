import cn from 'classnames';
import { useToggleAll } from './useToggleAll';

export const ToggleAllButton:React.FC = () => {
  const { isVisible, toggleAll, isActive } = useToggleAll();

  return isVisible ? (
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: isActive,
      })}
      data-cy="ToggleAllButton"
      aria-label="Toggle all todos!"
      onClick={toggleAll}
    />
  ) : <></>;
};
