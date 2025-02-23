import classNames from 'classnames';

interface Props {
  errorMessage: string;
  handleButtonClose: () => void;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  handleButtonClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleButtonClose}
      />
      {errorMessage}
    </div>
  );
};
