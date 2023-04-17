/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

type Props = {
  setErrorType: (value: string) => void,
  errorType: string,
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorType,
  errorType,
}) => {
  const closeErrorNotification = () => {
    setErrorType('');
  };

  const isError = errorType === '';

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeErrorNotification}
      />

      {errorType}
    </div>
  );
};
