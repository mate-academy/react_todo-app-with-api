import classNames from 'classnames';

type Props = {
  errorMessage: string;
  showError: boolean;
  setShowError: (errorState: boolean) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  showError,
  setShowError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !showError },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setShowError(false)}
    />
    {errorMessage}
  </div>
);
