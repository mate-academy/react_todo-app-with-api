import React, { useEffect } from 'react';

interface Props {
  onCancel: () => void;
}

export const SubmitOnEsc: React.FC<Props> = ({ onCancel }) => {
  useEffect(() => {
    const handleKeyDown = (event: { keyCode: number; }) => {
      if (event.keyCode === 27) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return null;
};
