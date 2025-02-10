import classNames from 'classnames';

interface Props {
  message: string;
  onClose: () => void;
}

export const ErrorMessange: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !message,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
