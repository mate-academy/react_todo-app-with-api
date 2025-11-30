export const Notification: React.FC<{
  error: string | null;
  onHide: () => void;
}> = ({ error, onHide }) => {
  const isHidden = !error;

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${isHidden ? 'hidden' : ''}`}
      role="alert"
      aria-hidden={isHidden}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
        aria-label="Close error"
      />
      {!isHidden && <div>{error}</div>}
    </div>
  );
};
