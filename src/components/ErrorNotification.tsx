type Props = {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
        }}
      >
        &nbsp;
      </button>
      <span>
        {errorMessage}
      </span>
    </div>
  );
};
