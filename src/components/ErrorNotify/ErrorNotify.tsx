import { ErrorMessage } from '../../types/enums';
import classNames from 'classnames';

interface Props {
  errorMsg: ErrorMessage;
  handleErrorMessage: (msgType: ErrorMessage) => void;
}

const ErrorNotify = ({ errorMsg, handleErrorMessage }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMsg,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleErrorMessage(ErrorMessage.None)}
      />
      {errorMsg}
    </div>
  );
};

export default ErrorNotify;
