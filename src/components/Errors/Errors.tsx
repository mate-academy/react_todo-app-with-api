interface Props {
  error: string;
  setError: (b: string) => void;
}

export const Errors = ({ error, setError }: Props) => {
  return (
    <div
      hidden={!error}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
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
