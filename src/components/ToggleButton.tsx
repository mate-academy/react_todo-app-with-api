import cn from 'classnames';
import React from 'react';

type ToggleButtonProps = {
  isActive: boolean,
  onToggleAll: (isAllActive: boolean) => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  onToggleAll,
}) => {
  const handleToggleAll = () => {
    onToggleAll(isActive);
  };

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      onClick={handleToggleAll}
      type="button"
      className={cn(
        'todoapp__toggle-all',
        {
          active: isActive,
        },
      )}
    />
  );
};
