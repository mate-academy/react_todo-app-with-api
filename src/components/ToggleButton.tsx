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
    <>
      <button
        id="toggleButton"
        onClick={handleToggleAll}
        type="button"
        className={cn(
          'todoapp__toggle-all',
          {
            active: isActive,
          },
        )}
        aria-label="Toggle Button"
      />
    </>
  );
};
