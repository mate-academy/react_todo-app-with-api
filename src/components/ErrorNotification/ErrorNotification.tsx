import classNames from 'classnames';

export type Props = {
  currentError: string | null;
  handleHideError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  currentError,
  handleHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !currentError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {currentError}
    </div>
  );
};
