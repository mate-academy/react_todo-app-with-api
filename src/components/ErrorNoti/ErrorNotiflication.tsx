import classNames from 'classnames';

type Props = {
  errorMessage: string;
  closeErrorHandler: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  closeErrorHandler,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage.length === 0 },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorHandler}
      />
      {errorMessage}
    </div>
  );
};
