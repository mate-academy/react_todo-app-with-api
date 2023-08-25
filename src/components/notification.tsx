/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorMessage';

type Props = {
  isMessageClosed: boolean,
  setIsMessageClosed: (value: boolean) => void,
  errorMessage: ErrorType,
};

export const ErrorNotification: React.FC<Props> = ({
  isMessageClosed,
  setIsMessageClosed,
  errorMessage,
}) => {
  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: isMessageClosed,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => {
          setIsMessageClosed(true);
        }}
      />
      {errorMessage}
    </div>
  );
};
