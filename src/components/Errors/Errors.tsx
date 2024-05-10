import cn from 'classnames';

interface Props {
  error: string;
  setError: (b: string) => void;
}

export const Errors = ({ error, setError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {/* show only one message at a time */}
      <div>
        {error}
        <br />
      </div>
    </div>
  );
};
