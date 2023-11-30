import { FC } from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string | null;
  setErrorMessage: (error: string | null) => void;
}

export const TodoNotification: FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const closeNotification = () => {
    setErrorMessage(null);
  };

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="close"
        onClick={closeNotification}
      />
      {errorMessage}
    </div>
  );
};
