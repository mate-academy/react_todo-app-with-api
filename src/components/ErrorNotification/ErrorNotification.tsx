import cn from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage, setErrorMessage,
}) => {
  setTimeout(() => setErrorMessage, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
