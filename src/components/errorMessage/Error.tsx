import classNames from 'classnames';

type Props = {
  error: string | null;
  hideError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ErrorMessage: React.FC<Props> = ({ error, hideError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => hideError(null)}
      />
      {error}
    </div>
  );
};
