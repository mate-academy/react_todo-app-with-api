/* eslint-disable jsx-a11y/control-has-associated-label */
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage;
  unSetError: (error: ErrorMessage.none) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, unSetError }) => (
  <div
    data-cy="ErrorNotification"
    className="notification is-danger is-light has-text-weight-normal"
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => unSetError(ErrorMessage.none)}
    />

    {error}
  </div>
);
