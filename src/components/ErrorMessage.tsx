import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorMessage: (error: string) => void;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
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
        onClick={e => {
          e.preventDefault();
          setErrorMessage('');
        }}
      />
      {errorMessage}
    </div>
  );
};
