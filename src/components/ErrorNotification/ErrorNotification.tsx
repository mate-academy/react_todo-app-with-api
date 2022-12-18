import { ErrorMessage } from "../../types/ErrorMessage";

type Props = {
  error: ErrorMessage,
  setError: (error: ErrorMessage) => void,
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const { error, setError } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorMessage.None)}
      />
      {error}
    </div>
  );
};
