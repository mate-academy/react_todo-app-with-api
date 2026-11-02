import cn from 'classnames';

type ErrorNotificationProps = {
  errorText: string;
  setErrorText: (text: string) => void;
};

export const ErrorNotification = ({
  errorText,
  setErrorText,
}: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorText,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorText('')}
      />
      {errorText}
    </div>
  );
};
