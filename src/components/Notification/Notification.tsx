import classNames from 'classnames';

type Props = {
  deleteError: (value: string) => void;
  errorMessage: string;
};

export const Notification: React.FC<Props> = ({
  deleteError,
  errorMessage,
}) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => deleteError('')}
        aria-label="delete"
      />
      {errorMessage}
    </div>
  );
};
