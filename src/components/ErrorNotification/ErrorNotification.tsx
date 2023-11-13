import classNames from 'classnames';

type Props = {
  errorMesssage: string,
  onErrorMesssageChange: (val: string) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMesssage,
  onErrorMesssageChange,
}) => {
  const removeErrorMessage = () => onErrorMesssageChange('');

  if (errorMesssage) {
    setTimeout(removeErrorMessage, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMesssage },
      )}
    >
      <button
        aria-label="error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={removeErrorMessage}
      />
      {errorMesssage}
    </div>
  );
};
