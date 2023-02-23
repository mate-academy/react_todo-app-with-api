/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  handleError: (error: ErrorMessage) => void;
  errorMessage: string;
};

export const Notifications: React.FC<Props> = ({
  handleError,
  errorMessage,
}) => {
  const handleCloseButton = () => {
    handleError(ErrorMessage.None);
  };

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseButton}
      />

      <p>{errorMessage}</p>

    </div>
  );
};
