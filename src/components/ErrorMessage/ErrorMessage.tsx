interface ErrorMessageProps {
  message: string;
  clearMessage: () => void;
}
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  clearMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!message && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => clearMessage()}
      />
      {message}
    </div>
  );
};
