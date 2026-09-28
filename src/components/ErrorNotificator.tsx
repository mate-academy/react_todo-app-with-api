import cn from 'classnames';

type Props = {
  errorMessages: string[];
  onClose: () => void;
};

export const ErrorNotificator: React.FC<Props> = ({
  errorMessages,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessages.length === 0 },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose()}
      />
      {/* show only one message at a time */}
      {errorMessages.map((msg, index) => (
        <div key={index}>
          {msg}
          <br />
        </div>
      ))}
    </div>
  );
};
