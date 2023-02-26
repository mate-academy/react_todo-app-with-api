import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  clearErrorMessage: () => void;
};

export const Notification: React.FC<Props> = (
  { errorMessage, clearErrorMessage },
) => {
  useEffect(() => {
    setTimeout(clearErrorMessage, 3000);
  }, []);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      {// eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button type="button" className="delete" />
      }
      {errorMessage}
    </div>
  );
};
