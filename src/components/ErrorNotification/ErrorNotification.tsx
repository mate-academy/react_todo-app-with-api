/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  errorMessage: string;
  onError: (errorMessage: string) => void;
}

export const ErrorNotification = (props: Props) => {
  const { errorMessage, onError } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError('')}
      />
      {errorMessage}
    </div>
  );
};
