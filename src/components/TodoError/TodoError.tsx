import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: string,
  setErrorMessage: (message: ErrorMessage) => void,
};

export const TodoError: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
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
        onClick={() => setErrorMessage('')}
      >
        ×
      </button>

      {errorMessage}
    </div>
  );
};
