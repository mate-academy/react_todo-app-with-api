import classNames from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
};

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="error button"
      />
      {/* show only one message at a time */}
      {!!errorMessage && errorMessage}
    </div>
  );
};
